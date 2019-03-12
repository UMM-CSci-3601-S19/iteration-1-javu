package umm3601.ride;

import com.mongodb.MongoException;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;
import org.bson.types.ObjectId;

import java.util.Iterator;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static com.mongodb.client.model.Filters.eq;



public class RideController {

  private final MongoCollection<Document> rideCollection;

  public RideController(MongoDatabase database) {
    rideCollection = database.getCollection("Rides");
  }

  String getRide(String id) {
    FindIterable<Document> jsonRides = rideCollection.find(eq("_id", new ObjectId(id)));

    Iterator<Document> iterator = jsonRides.iterator();
    if (iterator.hasNext()) {
      Document ride = iterator.next();
      return ride.toJson();
    } else {
      // We didn't find the desired ride
      return null;
    }
  }

  String getRides(Map<String, String[]> queryParams) {

    Document filterDoc = new Document();

    if (queryParams.containsKey("driver")) {
      String targetContent = (queryParams.get("driver")[0]);
      Document contentRegQuery = new Document();
      contentRegQuery.append("$regex", targetContent);
      contentRegQuery.append("$options", "i");
      filterDoc = filterDoc.append("driver", contentRegQuery);
    }

    //FindIterable comes from mongo, Document comes from Gson
    FindIterable<Document> matchingRides = rideCollection.find(filterDoc);

    return serializeIterable(matchingRides);
  }


  /*
   * Take an iterable collection of documents, turn each into JSON string
   * using `document.toJson`, and then join those strings into a single
   * string representing an array of JSON objects.
   */
  private String serializeIterable(Iterable<Document> documents) {
    return StreamSupport.stream(documents.spliterator(), false)
      .map(Document::toJson)
      .collect(Collectors.joining(", ", "[", "]"));
  }

  String addNewRide(String driver, String destination, String origin, Boolean roundTrip, String departureTime, String notes) {

    Document newRide = new Document();
    newRide.append("driver", driver);
    newRide.append("destination", destination);
    newRide.append("origin", origin);
    newRide.append("roundTrip,", roundTrip);
    newRide.append("departureTime", departureTime);
    newRide.append("notes", notes);


    try {
      rideCollection.insertOne(newRide);
      ObjectId _id = newRide.getObjectId("_id");
      System.err.println("Successfully added new ride [_id=" + _id + ", driver=" + driver + ", destination=" + destination + ", origin=" + origin + ", roundTrip=" + roundTrip + " departureTime=" + departureTime + " notes=" + notes + ']');
      return _id.toHexString();
    } catch (MongoException me) {
      me.printStackTrace();
      return null;
    }
  }

  String deleteRide(String id){
    ObjectId objId = new ObjectId(id);
    try{
      return rideCollection.deleteOne(new Document("_id", objId)).toString();
    }
    catch(MongoException e){
      e.printStackTrace();
      return null;
    }
  }
}

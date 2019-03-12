package umm3601.ride;

import com.mongodb.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.junit.Before;
import org.bson.*;
import org.bson.codecs.*;
import org.bson.codecs.configuration.CodecRegistries;
import org.bson.codecs.configuration.CodecRegistry;
import org.bson.json.JsonReader;
import org.bson.types.ObjectId;
import com.mongodb.BasicDBObject;
import org.junit.Test;


import java.util.*;
import java.util.stream.Collectors;

import static junit.framework.TestCase.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;

public class RideControllerSpec {
  private RideController rideController;
  private ObjectId knownId;

  @Before
  public void clearAndPopulateDB(){
    MongoClient mongoClient = new MongoClient();
    MongoDatabase db = mongoClient.getDatabase("test");
    MongoCollection<Document> rideDocuments = db.getCollection("Rides");
    rideDocuments.drop();
    List<Document> testRides = new ArrayList<>();
    testRides.add(Document.parse("{\n" +
      "driver: \"Marci Sears\",\n" +
      "riders: \"5c817c356e1e7c3c544638fd\",\n" +
      "destination: \"Maplegrove\",\n" +
      "origin: \"Knight Court\",\n" +
      "roundTrip: true,\n" +
      "departureTime: \"Mon Aug 07 2017 15:00:32 GMT+0000 (UTC)\",\n" +
      "driving: true,\n" +
      "notes: \"I like to drive with Y	no air conditioning\"\n" +
      "}"));
    testRides.add(Document.parse("{\n" +
      "driver: \"Boyer Kramer\",\n" +
      "riders: \"5c817c358f1702ea7c5f4ee3\",\n" +
      "destination: \"St.Paul\",\n" +
      "origin: \"Polar Street\",\n" +
      "roundTrip: false,\n" +
      "departureTime: \"Tue Jun 30 2020 09:47:19 GMT+0000 (UTC)\",\n" +
      "driving: false,\n" +
      "notes: \"No room in the trunk of my car\"\n" +
      "}"));
    testRides.add(Document.parse("{\n" +
      "driver: \"Millie Flores\",\n" +
      "riders: \"5c817c35004535b2c6789e1a\",\n" +
      "destination: \"Duluth\",\n" +
      "origin: \"Oliver Street\",\n" +
      "roundTrip: true,\n" +
      "departureTime: \"Sun Sep 18 2022 01:29:42 GMT+0000 (UTC)\",\n" +
      "driving: false,\n" +
      "notes: \"I love to crank the volume up to 11\"\n" +
      "}"));
    rideDocuments.insertMany(testRides);

    knownId = new ObjectId();
    BasicDBObject knownObj = new BasicDBObject("_id", knownId);
    knownObj = knownObj
      .append("driver", "Carter Browning")
      .append("riders", "5c817c356e1e7c3c544638fd")
      .append("destination", "Maplegrove")
      .append("origin", "Balfour Place")
      .append("roundTrip", false)
      .append("departureTime", "Sat Apr 22 2017 06:12:11 GMT+0000 (UTC)")
      .append("driving", true)
      .append("notes", "I will pay for lunch for anyone who is riding with me and I am a cool guy");
    rideDocuments.insertOne(Document.parse(knownObj.toJson()));

    rideController = new RideController(db);
  }
  private static BsonArray parseJsonArray(String json) {
    final CodecRegistry codecRegistry
      = CodecRegistries.fromProviders(Arrays.asList(
      new ValueCodecProvider(),
      new BsonValueCodecProvider(),
      new DocumentCodecProvider()));

    JsonReader reader = new JsonReader(json);
    BsonArrayCodec arrayReader = new BsonArrayCodec(codecRegistry);

    return arrayReader.decode(reader, DecoderContext.builder().build());
  }
  private static String getAttribute(BsonValue val, String attribute){
    BsonDocument doc = val.asDocument();
    return ((BsonString) doc.get(attribute)).getValue();
  }
  private static String getDriver(BsonValue val) {
    return getAttribute(val, "driver");
  }
  private static String getDestination(BsonValue val) {
    return getAttribute(val, "destination");
  }
  @Test
  public void getAllRides() {
    Map<String, String[]> emptyMap = new HashMap<>();
    String jsonResult = rideController.getRides(emptyMap);
    BsonArray docs = parseJsonArray(jsonResult);
    assertEquals("Should have 4 riders", 4, docs.size());
    List<String> drivers = docs
      .stream()
      .map(RideControllerSpec::getDriver)
      .sorted()
      .collect(Collectors.toList());
    List<String> expectedDrivers = Arrays.asList("Boyer Kramer", "Carter Browning", "Marci Sears", "Millie Flores");
    assertEquals("Drivers should match", expectedDrivers, drivers);
  }
  @Test
  public void getRideById(){
    String jsonResult = rideController.getRide(knownId.toString());
    Document result = Document.parse(jsonResult);
    assertEquals("Driver should match", "Carter Browning", result.get("driver"));
    String noJsonResult = rideController.getRide(new ObjectId().toString());
    assertNull("No ride should be found", noJsonResult);
  }
  @Test
  public void addRide(){
    Map<String, String[]> emptyMap = new HashMap<>();
    String beforeResult = rideController.getRides(emptyMap);
    BsonArray beforeDocs = parseJsonArray(beforeResult);
    assertEquals("Should have 4 riders before adding a new one", 4, beforeDocs.size());
    String jsonResult = rideController.addNewRide("Good Driver", "Far, Far Away", "The RFC", false, "Noon Tomorrow", "We're never coming back.");
    assertNotNull("Add ride result should not be null", jsonResult);
    String afterResult = rideController.getRides(emptyMap);
    BsonArray afterDocs = parseJsonArray(afterResult);
    assertEquals("Should have 5 riders after adding a new one", 5, afterDocs.size());
    List<String> destinations = afterDocs
      .stream()
      .map(RideControllerSpec::getDestination)
      .collect(Collectors.toList());
    assertTrue("Should contain newly added destination", destinations.contains("Far, Far Away"));
  }
  @Test
  public void deleteRide(){
    Map<String, String[]> emptyMap = new HashMap<>();
    //Pre-deletion testing
    String beforeResult = rideController.getRides(emptyMap);
    BsonArray beforeDocs = parseJsonArray(beforeResult);
    assertEquals("Should have 4 riders before deletion", 4, beforeDocs.size());
    List<String> beforeDrivers = beforeDocs
      .stream()
      .map(RideControllerSpec::getDriver)
      .sorted()
      .collect(Collectors.toList());
    List<String> expectedBeforeDrivers = Arrays.asList("Boyer Kramer", "Carter Browning", "Marci Sears", "Millie Flores");
    assertEquals("Drivers should match before deletion", expectedBeforeDrivers, beforeDrivers);
    //Deletion
    rideController.deleteRide(knownId.toString());
    //Post-deletion testing
    String afterResult = rideController.getRides(emptyMap);
    BsonArray afterDocs = parseJsonArray(afterResult);
    assertEquals("Should have 3 riders after deletion", 3, afterDocs.size());
    List<String> afterDrivers = afterDocs
      .stream()
      .map(RideControllerSpec::getDriver)
      .sorted()
      .collect(Collectors.toList());
    List<String> expectedAfterDrivers = Arrays.asList("Boyer Kramer", "Marci Sears", "Millie Flores");
    assertEquals("Drivers should match after deletion", expectedAfterDrivers, afterDrivers);


  }
}

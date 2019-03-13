package umm3601.ride;

import org.bson.Document;
import org.bson.types.ObjectId;
import spark.Request;
import spark.Response;

public class RideRequestHandler {

  private final RideController rideController;

  public RideRequestHandler(RideController rideController) {
    this.rideController = rideController;
  }

  /**
   * Method called from Server when the 'api/rides/:id' endpoint is received.
   * Get a JSON response with a list of all the rides in the database.
   *
   * @param req the HTTP request
   * @param res the HTTP response
   * @return one ride in JSON formatted string and if it fails it will return text with a different HTTP status code
   */
  public String getRideJSON(Request req, Response res) {
    res.type("application/json");
    String destination = req.params("destination");
    String ride;
    try {
      ride = rideController.getRide(destination);
    } catch (IllegalArgumentException e) {
      // This is thrown if the ID doesn't have the appropriate
      // form for a Mongo Object ID.
      // https://docs.mongodb.com/manual/reference/method/ObjectId/
      res.status(400);
      res.body("The requested ride destination " + destination + " wasn't a legal Mongo Object ID.\n" +
        "See 'https://docs.mongodb.com/manual/reference/method/ObjectId/' for more info.");
      return "";
    }
    if (ride != null) {
      return ride;
    } else {
      res.status(404);
      res.body("The requested ride with id " + destination + " was not found");
      return "";
    }
  }


  /**
   * Method called from Server when the 'api/rides' endpoint is received.
   * This handles the request received and the response
   * that will be sent back.
   *
   * @param req the HTTP request
   * @param res the HTTP response
   * @return an array of rides in JSON formatted String
   */
  public String getRides(Request req, Response res) {
    res.type("application/json");
    return rideController.getRides(req.queryMap().toMap());
  }


  /**
   * Method called from Server when the 'api/rides/new' endpoint is received.
   * Gets specified ride info from request and calls addNewRide helper method
   * to append that info to a document
   *
   * @param req the HTTP request
   * @param res the HTTP response
   * @return a boolean as whether the ride was added successfully or not
   */
  public String addNewRide(Request req, Response res) {
    res.type("application/json");

    Document newRide = Document.parse(req.body());

    String driver = newRide.getString("driver");
    String destination = newRide.getString("destination");
    String origin = newRide.getString("origin");
    Boolean roundTrip = newRide.getBoolean("roundTrip");
    String departureTime = newRide.getString("departureTime");
    String notes = newRide.getString("notes");


    System.err.println("Adding new ride [driver=" + driver + " destination=" + destination + " origin=" + origin + " roundTrip=" + roundTrip + " departureTime=" + departureTime + " notes=" + notes + ']');
    return rideController.addNewRide(driver, destination, origin, roundTrip, departureTime, notes);
  }

  public Boolean updateRide(Request req, Response res) {
    res.type("application/json");

    Document editRide = Document.parse(req.body());

    String id = editRide.getObjectId("_id").toHexString();
    String driver = editRide.getString("driver");
    String destination = editRide.getString("destination");
    String origin = editRide.getString("origin");
    Boolean roundTrip = editRide.getBoolean("roundTrip");
    String departureTime = editRide.getString("departureTime");
    String notes = editRide.getString("notes");


    System.err.println("Editing ride [id=" + id + " driver=" + driver + " destination=" + destination + " origin=" + origin + " roundTrip=" + roundTrip + " departureTime=" + departureTime + " notes=" + notes + ']');
    return rideController.updateRide(id, driver, destination, origin, roundTrip, departureTime, notes);
  }



}

package umm3601.ride;

import org.bson.Document;
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
    String id = req.params("id");
    String ride;
    try {
      ride = rideController.getRide(id);
    } catch (IllegalArgumentException e) {
      // This is thrown if the ID doesn't have the appropriate
      // form for a Mongo Object ID.
      // https://docs.mongodb.com/manual/reference/method/ObjectId/
      res.status(400);
      res.body("The requested ride id " + id + " wasn't a legal Mongo Object ID.\n" +
        "See 'https://docs.mongodb.com/manual/reference/method/ObjectId/' for more info.");
      return "";
    }
    if (ride != null) {
      return ride;
    } else {
      res.status(404);
      res.body("The requested ride with id " + id + " was not found");
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

    String param1 = newRide.getString("param1");
    int param2 = newRide.getInteger("param2");
    String param3 = newRide.getString("param3");
    String param4 = newRide.getString("param4");

    System.err.println("Adding new ride [param1=" + param1 + ", param2=" + param2 + " param3=" + param3 + " param4=" + param4 + ']');
    return rideController.addNewRide(param1, param2, param3, param4);
  }
}

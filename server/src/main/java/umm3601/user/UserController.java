package umm3601.user;

import com.google.gson.Gson;
import com.mongodb.*;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.util.JSON;
import org.bson.Document;
import org.bson.types.ObjectId;
import java.util.Iterator;
import java.util.Map;

import static com.mongodb.client.model.Filters.eq;

/**
 * Controller that manages requests for info about users.
 */
public class UserController {

    private final Gson gson;
    private MongoDatabase database;
    private final MongoCollection<Document> userCollection;

    /**
     * Construct a controller for users.
     *
     * @param database the database containing user data
     */
    public UserController(MongoDatabase database) {
        gson = new Gson();
        this.database = database;
        userCollection = database.getCollection("users");
    }


     /**
     * Method called from Server when the 'api/users/:id' endpoint is received.
     *
     * @param req the HTTP request
     * @param res the HTTP response
     * @return one user in JSON formatted string and if it fails it will return text with a different HTTP status code
     */
    public String getUser(Request req, Response res){
        res.type("application/json");
        String id = req.params("id");
        String user;
        try {
            user = getUser(id);
        } catch (IllegalArgumentException e) {
            // This is thrown if the ID doesn't have the appropriate
            // form for a Mongo Object ID.
            // https://docs.mongodb.com/manual/reference/method/ObjectId/
            res.status(400);
            res.body("The requested user id " + id + " wasn't a legal Mongo Object ID.\n" +
                "See 'https://docs.mongodb.com/manual/reference/method/ObjectId/' for more info.");
            return "";
        }
        if (user != null) {
            return user;
        } else {
            res.status(404);
            res.body("The requested user with id " + id + " was not found");
            return "";
        }
    }


    /**
     * Helper method that gets a single user specified by the `id`
     * parameter in the request.
     *
     * @param id the Mongo ID of the desired user
     * @return the desired user as a JSON object if the user with that ID is found,
     * and `null` if no user with that ID is found
     */

    public String getUser(String id) {
        FindIterable<Document> jsonUsers
            = userCollection
            .find(eq("_id", new ObjectId(id)));

        Iterator<Document> iterator = jsonUsers.iterator();
        if (iterator.hasNext()) {
            Document user = iterator.next();
            return user.toJson();
        } else {
            // We didn't find the desired user
            return null;
        }
    }


    /** Method called from Server when the 'api/users' endpoint is received.
     * This handles the request received and the response
     * that will be sent back.
     * @param req
     * @param res
     * @return an array of users in JSON formatted String
     */
    public String getUsers(Request req, Response res)
    {
        res.type("application/json");
        return getUsers(req.queryMap().toMap());
    }

    /** Helper method which iterates through the collection, receiving all
     * documents if no query parameter is specified. If the age query parameter
     * is specified, then the collection is filtered so only documents of that
     * specified age are found.
     *
    /**
     * @param queryParams
     * @return an array of Users in a JSON formatted string
     */
    public String getUsers(Map<String, String[]> queryParams) {

        Document filterDoc = new Document();

        if (queryParams.containsKey("age")) {
            int targetAge = Integer.parseInt(queryParams.get("age")[0]);
            filterDoc = filterDoc.append("age", targetAge);
        }

        if (queryParams.containsKey("company")) {
            String targetContent = (queryParams.get("company")[0]);
            Document contentRegQuery = new Document();
            contentRegQuery.append("$regex", targetContent);
            contentRegQuery.append("$options", "i");
            filterDoc = filterDoc.append("company", contentRegQuery);
        }

        //FindIterable comes from mongo, Document comes from Gson
        FindIterable<Document> matchingUsers = userCollection.find(filterDoc);

        return JSON.serialize(matchingUsers);
    }

    /**Method called from Server when the 'api/users/new'endpoint is recieved.
     * Gets specified user info from request and calls addNewUser helper method
     * to append that info to a document
     *
     * @param req
     * @param res
     * @return
     */
    public boolean addNewUser(Request req, Response res)
    {

        res.type("application/json");
        Object o = JSON.parse(req.body());
        try {
            if(o.getClass().equals(BasicDBObject.class))
            {
                try {
                    BasicDBObject dbO = (BasicDBObject) o;

                    String name = dbO.getString("name");
                    //For some reason age is a string right now, caused by angular.
                    //This is a problem and should not be this way but here ya go
                    int age = dbO.getInt("age");
                    String company = dbO.getString("company");
                    String email = dbO.getString("email");

                    System.err.println("Adding new user [name=" + name + ", age=" + age + " company=" + company + " email=" + email + ']');
                    return addNewUser(name, age, company, email);
                }
                catch(NullPointerException e)
                {
                    System.err.println("A value was malformed or omitted, new user request failed.");
                    return false;
                }

            }
            else
            {
                System.err.println("Expected BasicDBObject, received " + o.getClass());
                return false;
            }
        }
        catch(RuntimeException ree)
        {
            ree.printStackTrace();
            return false;
        }
    }

    /**Helper method which appends received user information to the to-be added document
    /**
     *
     * @param name
     * @param age
     * @param company
     * @param email
     * @return boolean after successfully or unsuccessfully adding a user
     */
    public boolean addNewUser(String name, int age, String company, String email) {

        Document newUser = new Document();
        newUser.append("name", name);
        newUser.append("age", age);
        newUser.append("company", company);
        newUser.append("email", email);

        try {
            userCollection.insertOne(newUser);
        }
        catch(MongoException me)
        {
            me.printStackTrace();
            return false;
        }

        return true;
    }




}

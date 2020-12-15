package controllers;


import org.glassfish.jersey.media.multipart.FormDataParam;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import server.Main;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.sql.PreparedStatement;
import java.sql.ResultSet;



import javax.ws.rs.CookieParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.UUID;


@Path("users/")
@Consumes(MediaType.MULTIPART_FORM_DATA)
@Produces(MediaType.APPLICATION_JSON)

public class Users {
    @GET
    @Path("list")
    public String UsersList() {
        System.out.println("Invoked Users.UsersList()");
        JSONArray response = new JSONArray();
        try {
            PreparedStatement ps = Main.db.prepareStatement("SELECT userID, username FROM user");
            ResultSet results = ps.executeQuery();
            while (results.next() == true) {
                JSONObject row = new JSONObject();
                row.put("UserID", results.getInt(1));
                row.put("username", results.getString(2));
                response.add(row);
            }
            return response.toString();
        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage());
            return "{\"Error\": \"Unable to list items.  Error code xx.\"}";
        }
    }

    @GET
    @Path("get/{UserID}")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public String GetUser(@PathParam("UserID") Integer UserID) {
        System.out.println("Invoked Users.GetUser() with UserID " + UserID);
        try {
            PreparedStatement ps = Main.db.prepareStatement("SELECT username,email,password FROM user WHERE userID = ?");
            ps.setInt(1, UserID);
            ResultSet results = ps.executeQuery();
            JSONObject response = new JSONObject();
            if (results.next() == true) {
                response.put("userID", UserID);
                response.put("username", results.getString(1));
                response.put("email", results.getString(2));
                response.put("password", results.getString(3));
            }
            return response.toString();
        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage());
            return "{\"Error\": \"Unable to get item, please see server console for more info.\"}";
        }
    }

    @POST
    @Path("add")
    public String UsersAdd(@FormDataParam("username") String username, @FormDataParam("email") String email, @FormDataParam("password") String password) {
        System.out.println("Invoked Users.UsersAdd()");
        try {
            PreparedStatement ps = Main.db.prepareStatement("INSERT INTO user (username, email,password) VALUES (?, ?,?)");
            ps.setString(1, username);
            ps.setString(2, email);
            ps.setString(3, password);

            ps.execute();
            return "{\"OK\": \"Added user.\"}";
        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage());
            return "{\"Error\": \"Unable to create new item, please see server console for more info.\"}";
        }

    }

    @POST
    @Path("update")
    public String updateuser(@FormDataParam("UserID") Integer UserID, @FormDataParam("UserName") String UserName) {
        try {
            System.out.println("Invoked Users.UpdateUsers/update UserID=" + UserID);
            PreparedStatement ps = Main.db.prepareStatement("UPDATE user SET username = ? WHERE userID = ?");
            ps.setString(1, UserName);
            ps.setInt(2, UserID);
            ps.execute();
            return "{\"OK\": \"Users updated\"}";
        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage());
            return "{\"Error\": \"Unable to update item, please see server console for more info.\"}";
        }
    }

    @POST
    @Path("delete/{username}")
    public String DeleteUser(@PathParam("username") String username) throws Exception {
        System.out.println("Invoked Users.DeleteUser()");
        if (username == null) {
            throw new Exception("UserID is missing in the HTTP request's URL.");
        }
        try {
            PreparedStatement ps = Main.db.prepareStatement("DELETE FROM user WHERE username = ?");
            ps.setString(1, username);
            ps.execute();
            return "{\"OK\": \"User deleted\"}";
        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage());
            return "{\"Error\": \"Unable to delete item, please see server console for more info.\"}";
        }
    }


    @POST
    @Path("login")
    public String loginUser(@FormDataParam("username") String username, @FormDataParam("password") String password) {
        System.out.println("Invoked loginUser() on path user/login");
        try {
            PreparedStatement ps1 = Main.db.prepareStatement("SELECT password FROM user WHERE username = ?");
            ps1.setString(1, username);
            ResultSet loginResults = ps1.executeQuery();
            if (loginResults.next() == true) {
                String correctPassword = loginResults.getString(1);
                if (password.equals(correctPassword)) {
                    String token = UUID.randomUUID().toString();
                    System.out.println(token);
                    PreparedStatement ps2 = Main.db.prepareStatement("UPDATE user SET token = ? WHERE username = ?");
                    ps2.setString(1, token);
                    ps2.setString(2, username);
                    ps2.executeUpdate();
                    JSONObject userDetails = new JSONObject();
                    userDetails.put("username", username);
                    userDetails.put("token", token);
                    String temp = userDetails.toString();
                    System.out.println(temp);
                    return temp;
                } else {
                    return "{\"Error\": \"Incorrect password!\"}";
                }
            } else {
                return "{\"Error\": \"Username and password are incorrect.\"}";
            }
        } catch (Exception exception) {
            System.out.println("Database error during /user/login: " + exception.getMessage());
            return "{\"Error\": \"Server side error!\"}";
        }
    }

    @GET
    @Path("cookie")
    public static String validToken(@CookieParam("token")String token) {		// this method MUST be called before any data is returned to the browser
        // token is taken from the Cookie sent back automatically with every HTTP request
        System.out.println("Invoked cookie() on path user/cookie");

        try {
            PreparedStatement ps = Main.db.prepareStatement("SELECT userID FROM user WHERE token = ?");
            ps.setString(1, token);
            ResultSet logoutResults = ps.executeQuery();
            return logoutResults.next() ? "true" : "false";   //logoutResults.next() will be true if there is a record in the ResultSet
        } catch (Exception exception) {
            System.out.println("Database error" + exception.getMessage());
            return "false";
        }
    }
    @POST
    @Path("logout")
    public static String logout(@CookieParam("token") String token){
        try{
            System.out.println("users/logout "+ token);
            PreparedStatement ps = Main.db.prepareStatement("SELECT userID FROM user WHERE token=?");
            ps.setString(1, token);
            ResultSet logoutResults = ps.executeQuery();
            if (logoutResults.next()){
                int userID = logoutResults.getInt(1);
                //Set the token to null to indicate that the user is not logged in
                PreparedStatement ps1 = Main.db.prepareStatement("UPDATE user SET token = NULL WHERE userID = ?");
                ps1.setInt(1, userID);
                ps1.executeUpdate();
                return "{\"status\": \"OK\"}";
            } else {
                return "{\"error\": \"Invalid token!\"}";

            }
        } catch (Exception ex) {
            System.out.println("Database error during /users/logout: " + ex.getMessage());
            return "{\"error\": \"Server side error!\"}";
        }
    }
    @GET
    @Path("checkuser")
    public static String checkuser(@CookieParam("token") String token){
        try{
            System.out.println("users/logout "+ token);
            PreparedStatement ps = Main.db.prepareStatement("SELECT userID FROM user WHERE token=?");
            ps.setString(1, token);
            ResultSet results = ps.executeQuery();
            JSONObject response = new JSONObject();
            System.out.println(results.toString());
            System.out.println(response.toString());
            return results.toString();
        } catch (Exception ex) {
            System.out.println("Database error during /users/logout: " + ex.getMessage());
            return "{\"error\": \"Server side error!\"}";
        }
    }
    @GET
    @Path("getbyusern/{username}")
    public String GetUser(@PathParam("username") String username) {
        System.out.println("Invoked Users.GetUser() with UserID " + username);
        try {
            PreparedStatement ps = Main.db.prepareStatement("SELECT userID,username,email,password,token FROM user WHERE username = ?");
            ps.setString(1, username);
            ResultSet results = ps.executeQuery();
            JSONObject response = new JSONObject();
            if (results.next() == true) {
                response.put("userID", results.getInt(1));
                response.put("username", results.getString(2));
                response.put("email", results.getString(3));
                response.put("password", results.getString(4));
                response.put("token", results.getString(5));
            }
            System.out.println(response.toString());
            return response.toString();
        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage());
            return "{\"Error\": \"Unable to get item, please see server console for more info.\"}";
        }
    }

}
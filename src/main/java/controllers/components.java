package controllers;


import org.glassfish.jersey.media.multipart.FormDataParam;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import server.Main;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

@Path("components/")
@Consumes(MediaType.MULTIPART_FORM_DATA)
@Produces(MediaType.APPLICATION_JSON)
public class components {

    @GET
    @Path("list")
    public String CPUList() {
        JSONArray response = new JSONArray();
        try {
            PreparedStatement ps = Main.db.prepareStatement("SELECT CPUname,Codename,Cores,Clock,Socket,Process,L3Cache,TDP,ReleaseDate,GPUname,Chip,GPUrelease,GPUbus,GPUMemory,GPUclock,GPUmemclock,shaders FROM components ");
            ResultSet results = ps.executeQuery();
            while (results.next()==true) {
                JSONObject row = new JSONObject();
                row.put("CPUname", results.getString(1));
                row.put("Codename", results.getString(2));
                row.put("Cores", results.getString(3));
                row.put("Clock", results.getString(4));
                row.put("Socket", results.getString(5));
                row.put("Process", results.getString(6));
                row.put("L3Cache", results.getString(7));
                row.put("TDP", results.getString(8));
                row.put("ReleaseDate", results.getString(9));
                row.put("GPUname", results.getString(10));
                row.put("Chip", results.getString(11));
                row.put("GPUrelease", results.getString(12));
                row.put("GPUbus", results.getString(13));
                row.put("GPUMemory", results.getString(14));
                row.put("GPUclock", results.getString(15));
                row.put("GPUmemclock", results.getString(16));
                row.put("shaders", results.getString(17));

                response.add(row);
                System.out.println(response);
            }
            return response.toString();
        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage());
            return "{\"Error\": \"Unable to list items.  Error code xx.\"}";
        }
    }

    @GET
    @Path("getcpu/{id}")
    public String Getname(@PathParam("id") String id) {
        System.out.println("Invoked Cpu.getid() with id =  " + id);
        try {
            PreparedStatement ps = Main.db.prepareStatement("SELECT CPUname,Codename,Cores,Clock,Socket,Process,L3Cache,TDP,ReleaseDate FROM components WHERE cpuID = ?");
            ps.setString(1, id);
            ResultSet results = ps.executeQuery();
            JSONObject response = new JSONObject();
            if (results.next() == true) {
                response.put("CPUname", results.getString(1));

            }
            System.out.println(response.toString());
            return response.toString();
        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage());
            return "{\"Error\": \"Unable to get item, please see server console for more info.\"}";
        }
    }

    @GET
    @Path("getgpu/{id}")
    public String Getgpuname(@PathParam("id") String id) {
        System.out.println("Invoked gpu.getid() with id =  " + id);
        try {
            PreparedStatement ps = Main.db.prepareStatement("SELECT GPUname,ReleaseDate FROM components WHERE GPUID = ?");
            ps.setString(1, id);
            ResultSet results = ps.executeQuery();
            JSONObject response = new JSONObject();
            if (results.next() == true) {
                response.put("GPUname", results.getString(1));
            }
            System.out.println(response.toString());
            return response.toString();
        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage());
            return "{\"Error\": \"Unable to get item, please see server console for more info.\"}";
        }
    }



    @POST
    @Path("addcpu/{name}")
    public String UsersAdd(@PathParam("name") String name) {
        System.out.println("Invoked save cpu new build");
        try {
            PreparedStatement ps = Main.db.prepareStatement("INSERT INTO savedbuilds (name) WHERE  VALUES = ?");
            ps.setString(1, name);

            ps.execute();
            return "{\"OK\": \"Added user.\"}";
        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage());
            return "{\"Error\": \"Unable to create new item, please see server console for more info.\"}";
        }

    }
}
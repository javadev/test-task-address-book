package com.github.addressbook.rest;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;

@Path("/contacts")
public class ContactRestService {

    @GET
    @Produces("application/json")
    public Contact getContacts() {
        Contact contact = new Contact();
        contact.setName("iPad 3");
        contact.setQty(999);        
        return contact; 
    }

    @POST
    @Consumes("application/json")
    public Response createContact(Contact contact) {
        String result = "Contact created : " + contact;
        return Response.status(201).entity(result).build();        
    }    
}


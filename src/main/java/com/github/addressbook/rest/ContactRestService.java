package com.github.addressbook.rest;

import java.util.List;

import com.github.addressbook.entity.Contact;
import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import javax.persistence.Query;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;

@Path("/contacts")
public class ContactRestService {

    protected static EntityManager em;

    static {
        EntityManagerFactory emf = Persistence.createEntityManagerFactory("contactsDatabase");
        em = emf.createEntityManager();
    }

    @GET
    @Produces("application/json")
    public List<Contact> getContacts() {
        Query query = em.createQuery("select c from Contact c");
        return query.getResultList();
    }

    @POST
    @Consumes("application/json")
    public Response createContact(Contact contact) {
        em.getTransaction().begin();
        em.persist(contact);
        em.getTransaction().commit();
        String result = "Contact was created : " + contact;
        return Response.status(201).entity(result).build();        
    }    

    @PUT
    @Path("/{id}")
    @Consumes("application/json")
    public Response updateContact(@PathParam("id") Long id, Contact contact) {
        em.getTransaction().begin();
        em.merge(contact);
        em.getTransaction().commit();
        String result = "Contact was updated : " + contact;
        return Response.status(204).entity(result).build();
    }

    @DELETE
    @Path("/{id}")
    @Produces("application/json")
    public Response deleteContact(@PathParam("id") Long id) {
        em.getTransaction().begin();
        Query query = em.createQuery("delete from Contact c where c.id = :id");
        query.setParameter("id", id);
        query.executeUpdate();
        em.getTransaction().commit();
        String result = "Contact was deleted : " + id;
        return Response.status(204).entity(result).build();
    }
}

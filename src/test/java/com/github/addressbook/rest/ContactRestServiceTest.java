package com.github.addressbook.rest;

import java.util.List;

import com.github.addressbook.entity.Contact;

import javax.ws.rs.core.Response;
import org.junit.Assert;
import org.junit.Test;

public class ContactRestServiceTest {
    private ContactRestService contactRestService = new ContactRestService() {
    };

    @Test
    public void getContacts() {
        List<Contact> contacts = contactRestService.getContacts();
        Assert.assertEquals(2, contacts.size());
    }

    @Test
    public void createContact() {
        Contact contact = new Contact();
        contact.setName("Name3");
        Response response = contactRestService.createContact(contact);
        Assert.assertEquals(201, response.getStatus());
    }

    @Test
    public void updateContact() {
        Contact contact = new Contact();
        contact.setId(1L);
        contact.setName("Name4");
        Response response = contactRestService.updateContact(1L, contact);
        Assert.assertEquals(204, response.getStatus());
    }

    @Test
    public void deleteContact() {
        Response response = contactRestService.deleteContact(1L);
        Assert.assertEquals(204, response.getStatus());
    }
}

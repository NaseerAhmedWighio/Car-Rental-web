import { DocumentTextIcon } from '@sanity/icons'
import { defineType } from "sanity";

export const Rental = defineType({
    name: 'rental',
    title: 'Car Rentals',
    type: 'document',
    icon: DocumentTextIcon,
    fields: [
        {
            name: "carTitle",
            title: "Car Name",
            type: "string",
            description: "Name of the rented car"
        },
        {
            name: "carSlug",
            title: "Car Slug",
            type: "string",
            description: "Slug of the car for linking"
        },
        {
            name: "category",
            title: "Category",
            type: "string",
            description: "Car category (e.g., Sport, Sedan, SUV)"
        },
        {
            name: "customerName",
            title: "Customer Name",
            type: "string",
            description: "Name of the customer renting the car"
        },
        {
            name: "customerPhone",
            title: "Customer Phone",
            type: "string",
            description: "Customer contact number"
        },
        {
            name: "customerEmail",
            title: "Customer Email",
            type: "string",
            description: "Customer email address"
        },
        {
            name: "pickupLocation",
            title: "Pickup Location",
            type: "string",
            description: "City or location where car is picked up"
        },
        {
            name: "pickupDate",
            title: "Pickup Date",
            type: "date",
            description: "Date when car is picked up"
        },
        {
            name: "pickupTime",
            title: "Pickup Time",
            type: "string",
            description: "Time when car is picked up"
        },
        {
            name: "dropoffLocation",
            title: "Drop-off Location",
            type: "string",
            description: "City or location where car is returned"
        },
        {
            name: "dropoffDate",
            title: "Drop-off Date",
            type: "date",
            description: "Date when car is returned"
        },
        {
            name: "dropoffTime",
            title: "Drop-off Time",
            type: "string",
            description: "Time when car is returned"
        },
        {
            name: "totalPrice",
            title: "Total Rental Price",
            type: "number",
            description: "Total price for the rental"
        },
        {
            name: "status",
            title: "Rental Status",
            type: "string",
            options: {
                list: [
                    { title: "Active", value: "active" },
                    { title: "Completed", value: "completed" },
                    { title: "Cancelled", value: "cancelled" },
                    { title: "Pending", value: "pending" }
                ],
                layout: "dropdown"
            },
            initialValue: "pending",
            description: "Current status of the rental"
        },
        {
            name: "pickupCoordinates",
            title: "Pickup GPS Coordinates",
            type: "geopoint",
            description: "GPS coordinates of pickup location"
        },
        {
            name: "dropoffCoordinates",
            title: "Drop-off GPS Coordinates",
            type: "geopoint",
            description: "GPS coordinates of dropoff location"
        },
        {
            name: "rentalId",
            title: "Rental ID",
            type: "string",
            description: "Unique rental reference number"
        },
        {
            name: "carImage",
            title: "Car Image",
            type: "image",
            description: "Image of the rented car"
        },
        {
            name: "rentedAt",
            title: "Rented At",
            type: "datetime",
            description: "When this rental was created"
        }
    ],
    orderings: [
        {
            title: 'Newest First',
            name: 'newestFirst',
            by: [
                { field: 'rentedAt', direction: 'desc' }
            ]
        }
    ],
    preview: {
        select: {
            title: 'carTitle',
            subtitle: 'customerName',
            media: 'carImage',
            status: 'status'
        },
        prepare(selection) {
            const { title, subtitle, media, status } = selection;
            return {
                title: `${title} - ${subtitle}`,
                media,
                subtitle: `Status: ${status}`
            };
        }
    }
});

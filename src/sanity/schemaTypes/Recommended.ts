import {DocumentTextIcon} from '@sanity/icons'
import { defineField, defineType } from "sanity";

    export const Recommended = defineType({
        name: 'recommended',
        title: 'Recommended Cars',
        type: 'document',
        icon: DocumentTextIcon,
        fields: [
            {
                name: "title",
                title: "Car Name",
                type : "string",
                description : "Enter Car Name"
            },
            defineField({
                name: 'slug',
                type: 'slug',
                options: {
                  source: 'title',
                },
              }),
            {
                name: "category",
                title: "Category",
                type : "string",
                description : "car category"
            },
            {
                name: "image",
                title: "Car Image",
                type : "image",
                description : "Select image"
            }, {
                name: "fuel",
                title: "Fuel",
                type : "string",
            },{
                name: "type",
                title: "Type",
                type : "string",
            },{
                name: "capacity",
                title: "Capacity",
                type : "string",
            },{
                name: "price",
                title: "Price",
                type : "string",
            },{
                name: "discount",
                title: "Discount",
                type : "string",
            },{
                name: "rating",
                title: "Rating",
                type : "number",
            },
        ],
    })
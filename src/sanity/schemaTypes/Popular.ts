import {DocumentTextIcon} from '@sanity/icons'
import { 
    // defineField,
     defineType } from "sanity";

    export const Popular = defineType({
        name: 'popular',
        title: 'Popular Cars',
        type: 'document',
        icon: DocumentTextIcon,
        fields: [
            {
                name: "title",
                title: "Car Name",
                type : "string",
                description : "Enter Car Name"
            },
            
            {
                name: 'slug',
                type: 'slug',
                description : "car Serail no."
              },
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
                name: "review",
                type: "array",  // Change this from "document" to "array"
                title: "Reviews",
                of: [
                    {
                        type: "object",
                        fields: [
                            {
                                name: "username",
                                type: "string",
                                title: "Username",
                            },
                            {
                                name: "subname",
                                type: "string",
                                title: "Subname",
                            },
                            {
                                name: "comment",
                                type: "text",
                                title: "Comment",
                            },
                            {
                                name: "rating",
                                type: "number",
                                title: "Rating",
                            },
                            {
                                name: "date",
                                type: "datetime",
                                title: "Date",
                            },
                            {
                                name: "imageUrl",
                                type: "string",
                                title: "Image URL",
                            },
                        ],
                    },
                ],
            },
        ],
    })
import mongoose from "mongoose";
import { ObjectId } from 'mongodb';

export const getAllBookByUserId = (id : string, size : number, offset : number,searchQuery: string) => [
    {
        $lookup: {
          from: "bookimages",
          localField: "_id",
          foreignField: "bookId",
          as: "cover",
        },
    },
    {
        $unwind: {
          path: "$cover",
        },
    },
    {
        $addFields: {
          "cover.filePath": {
            $concat: [process.env.DOMAIN_SERVER, "$cover.filePath"],
          },
        },
    },
    {
        $lookup: {
          from: "categories",
          let : { categoryIds : "$categoryIds" },
          pipeline : [
            {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $in: ["$_id", "$$categoryIds"],
                      },
                    ],
                  },
                },
            },
            {
                $project : {
                    _id : 0,
                    id : "$_id",
                    name : 1,
                }
            }
          ],
          as: "categories",
        },
    },
    {
        $project: {
          _id: 0,
          id: "$_id",
          categories: "$categories",
          title: 1,
          description: 1,
          author: 1,
          publisher: 1,
          quantity: 1,
          price: 1,
          userId: 1,
          createdAt: 1,
          updatedAt: 1,
          cover: "$cover.filePath",
        },
    },
    {
        $match : {
            $and : [
                {userId : new ObjectId(id)},
                {
                $or : [
                    searchQuery ? { 'title': { $regex: searchQuery, $options: 'i' }, } : {},
                    searchQuery ? { 'author': { $regex: searchQuery, $options: 'i' }, } : {},
                    searchQuery ? { 'publisher': { $regex: searchQuery, $options: 'i' }, } : {},
                    searchQuery ? { 'categories.name': { $regex: searchQuery, $options: 'i' }, } : {},
                ]
                }
            ]
        }
    },
    {
        $sort: {
            createdAt : -1
        }
      },
    {
        $facet: {
            count: [{ $count: 'total' }],
            items: [
                { $skip: +offset },
                { $limit: +size },
            ],
        },
    },
    {
        $project: {
            items: 1,
            total: { $arrayElemAt: ['$count.total', 0] },
        },
    },
]

export const getBookById = (id : string, userId : string) => [
    {
        $lookup: {
          from: "bookimages",
          localField: "_id",
          foreignField: "bookId",
          as: "cover",
        },
    },
    {
        $unwind: {
          path: "$cover",
        },
    },
    {
        $addFields: {
          "cover.filePath": {
            $concat: [process.env.DOMAIN_SERVER, "$cover.filePath"],
          },
        },
    },
    {
        $lookup: {
          from: "categories",
          let : { categoryIds : "$categoryIds" },
          pipeline : [
            {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $in: ["$_id", "$$categoryIds"],
                      },
                    ],
                  },
                },
            },
            {
                $project : {
                    _id : 0,
                    id : "$_id",
                    name : 1,
                }
            }
          ],
          as: "categories",
        },
    },
    {
        $project: {
          _id: 0,
          id: "$_id",
          categories: "$categories",
          title: 1,
          description: 1,
          author: 1,
          publisher: 1,
          quantity: 1,
          price: 1,
          userId: 1,
          createdAt: 1,
          updatedAt: 1,
          cover: "$cover.filePath",
        },
    },
    {
        $match : {
            $and : [
                { userId : new ObjectId(userId)},
                { id : new ObjectId(id)}
            ]
        }
    }
  ]

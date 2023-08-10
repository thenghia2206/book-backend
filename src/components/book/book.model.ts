import mongoose, { Document, Model} from "mongoose";
import { IBook } from "./book.types"; 

interface BookDocument extends IBook, Document { };
interface BookModel extends Model<BookDocument> { };

const BookSchema = new mongoose.Schema<BookDocument, BookModel> ( {
    title : {
        type : String,
        require : true,
    },
    description : {
        type : String,
    },
    author: {
        type : String,
    },
    publisher : {
        type : String,
    },
    categoryIds : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Category'
    }],
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    quantity : {
        type : String,
    },
    price : {
        type : String,
    },
    createdAt : Date,
    updatedAt : Date
})

BookSchema.set('toJSON', {
    virtuals : true,
    versionKey : false,
    transform: function ( doc, ret ) { delete ret._id }
});

const Book = mongoose.model<BookDocument, BookModel>('Book', BookSchema);

export default Book;

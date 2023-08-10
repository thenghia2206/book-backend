import mongoose, { Document, Model} from "mongoose";
import { IBookImage } from "./bookImage.types"; 

interface BookImageDocument extends IBookImage, Document { };
interface BookImageModel extends Model<BookImageDocument> { };

const BookImageSchema = new mongoose.Schema<BookImageDocument, BookImageModel> ( {
    bookId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Book'
    },
    filePath : {
        type : String,
    },
    createdAt : Date,
    updatedAt : Date
})

BookImageSchema.set('toJSON', {
    virtuals : true,
    versionKey : false,
    transform: function ( doc, ret ) { delete ret._id }
});

const BookImage = mongoose.model<BookImageDocument, BookImageModel>('BookImage', BookImageSchema);

export default BookImage; 
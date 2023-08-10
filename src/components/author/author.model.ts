import mongoose, { Document, Model} from "mongoose";
import { IAuthor } from "./author.types"; 

interface AuthorDocument extends IAuthor, Document { };
interface AuthorModel extends Model<AuthorDocument> { };

const AuthorSchema = new mongoose.Schema<AuthorDocument, AuthorModel> ( {
    name : {
        type : String,
        require : true
    },
    dob : {
        type : Date,
        default : null,
    },
    dod : {
        type : Date,
        default : null,
    },
    createdAt : Date,
    updatedAt : Date
})

AuthorSchema.set('toJSON', {
    virtuals : true,
    versionKey : false,
    transform: function ( doc, ret ) { delete ret._id }
});

const Author = mongoose.model<AuthorDocument, AuthorModel>('Author', AuthorSchema);

export default Author; 
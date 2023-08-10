import mongoose, { Document, Model} from "mongoose";
import { IPublisher } from "./publisher.types"; 

interface PublisherDocument extends IPublisher, Document { };
interface PublisherModel extends Model<PublisherDocument> { };

const PublisherSchema = new mongoose.Schema<PublisherDocument, PublisherModel> ( {
    name : {
        type : String,
        require : true
    },
    phoneNumber : {
        type : String,
    },
    address : {
        type : String,
    },
    createdAt : Date,
    updatedAt : Date
})

PublisherSchema.set('toJSON', {
    virtuals : true,
    versionKey : false,
    transform: function ( doc, ret ) { delete ret._id }
});

const Publisher = mongoose.model<PublisherDocument, PublisherModel>('Publisher', PublisherSchema);

export default Publisher; 
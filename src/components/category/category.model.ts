import mongoose, { Document, Model} from "mongoose";
import { ICategory } from "./category.types";

interface CategoryDocument extends ICategory, Document { };
interface CategoryModel extends Model<CategoryDocument> { };

const CategorySchema = new mongoose.Schema<CategoryDocument, CategoryModel> ( {
    name : {
        type : String,
        require : true
    },
    createdAt : Date,
    updatedAt : Date
})

CategorySchema.set('toJSON', {
    virtuals : true,
    versionKey : false,
    transform: function ( doc, ret ) { delete ret._id }
});

const Category = mongoose.model<CategoryDocument, CategoryModel>('Category', CategorySchema);

export default Category; 
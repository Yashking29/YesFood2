import mongoose from "mongoose";


const FoodSchema =new mongoose.Schema({
    item_id:{
        type:String, required:true,unique:true
    },
    name:{
          type:String, required:true,unique:true
    },
    price:{
        type:String, required:true,unique:true
    },
    img_src:{
        type:String, required:true,unique:true
    }
})

const Food_items = mongoose.model("Food_items",FoodSchema)

export {Food_items}
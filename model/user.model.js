const mongoose = require('mongoose')
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
    {
        surname:{
            type: String,
            required: true
        },
        name:{
            type: String,
            required: true
        },
        username: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 55,
            unique: true,
            trim: true
        },
        phone:{
            type: String,
            unique: true,
        },
        password:{
            type: String,
            required: true,
            max: 1024,
            minlength: 6,
        },
        picture: {
            type: String,
            default: "/upload/random-user.png"
        },
        about:{
            type: String,
            default: "Hello I am using WaChat"
        },
        contacts:{
            type: [String],
        },
    },
    {
        timestamps: true,
    }
);

// play function save into display : 'block

userSchema.pre("save", async function(next){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.statics.login = async function(username, password){
    const user = await this.findOne({username});
    if(user){
        const auth = await bcrypt.compare(password, user.password);
        if(auth){
            return user;
        }
        throw Error ('incorrect password');
    }
   throw Error ('incorrect username');
}

const UserModel =  mongoose.model('user',userSchema);
module.exports = UserModel;


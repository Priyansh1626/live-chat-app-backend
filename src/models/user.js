const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    picture: {
        type: String,
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAMIkR4ZdyhmCq0d21-dmX9Zt1kGpq8m0PPR8wnECA8wE1gF9xJ7M4PJ-M5bXB-OWy5wo&usqp=CAU"
    },
}, {
    timestamps: true,
})

userSchema.methods.matchPasswords = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

userSchema.pre('save', async function (next) {
    if (!this.isModified) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)
})

const User = mongoose.model('User', userSchema);

module.exports = User;
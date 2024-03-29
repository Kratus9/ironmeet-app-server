const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },

  gender: {
    type: String,
    required: true,
    
    enum: ["Male", "Female", "Other"],
  },
  
  age: {
    type: String,
    required: true,
  },
  
  location: {
    type: String,
    required: true,
    enum: [
      "Álava",
      "Albacete",
      "Alicante",
      "Almería",
      "Asturias",
      "Ávila",
      "Badajoz",
      "Barcelona",
      "Burgos",
      "Cáceres",
      "Cádiz",
      "Cantabria",
      "Castellón",
      "Ciudad Real",
      "Córdoba",
      "Cuenca",
      "Gerona",
      "Granada",
      "Guadalajara",
      "Guipúzcoa",
      "Huelva",
      "Huesca",
      "Islas Baleares",
      "Jaén",
      "La Coruña",
      "La Rioja",
      "Las Palmas",
      "León",
      "Lérida",
      "Lugo",
      "Madrid",
      "Málaga",
      "Murcia",
      "Navarra",
      "Orense",
      "Palencia",
      "Pontevedra",
      "Salamanca",
      "Santa Cruz de Tenerife",
      "Segovia",
      "Sevilla",
      "Soria",
      "Tarragona",
      "Teruel",
      "Toledo",
      "Valencia",
      "Valladolid",
      "Vizcaya",
      "Zamora",
      "Zaragoza",
    ],
  },

  preferences: {
    type: String,
    required: true,
    enum: ["Male", "Female", "Other"],
  },

  image: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ["user", "diamondMember", "admin"],
    default: "user",
  },


  lookingFor: {
    type: String,
    enum: [
      "long-term partner",
      "long-term but open to short-term",
      "short-term but open to long",
      "short-term fun",
      "new friends",
      "still figuring it out",
    ],
  },

  interests: {
    type: String,
    enum: [
      "Reading",
      "Traveling",
      "Television",
      "Cinema",
      "Music",
      "Video Games",
      "Sports",
      "Gym and Fitness",
      "Cooking",
      "Motor",
    ],
  },

  description: String,

  events: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
    },
  ],

  fanOf: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  ],
});

const User = mongoose.model("User", userSchema);
module.exports = User;
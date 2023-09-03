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

    enum: ["Male", "Female", "Non-binary"],
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
  image: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ["user", "goldmember", "admin"],
    default: "user",
  },

  preferences: {
    type: String,
    enum: ["Male", "Female", "I do not care"],
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

  events: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
    },
  ],

  fans: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

const User = mongoose.model("User", userSchema);
module.exports = User;
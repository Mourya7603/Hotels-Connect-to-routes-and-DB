const { initializeDatabase } = require("./db/db.connect");
const Hotel = require("./models/hotel.models");
const express = require("express");
const app = express();
const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
initializeDatabase();
async function createHotel(data) {
  try {
    const hotel = new Hotel(data);
    const savedHotel = await hotel.save();
    console.log("New Hotel data:", savedHotel);
    return savedHotel;
  } catch (error) {
    throw error;
  }
}

// POST route to add a hotel
app.post("/hotels", async (req, res) => {
  try {
    const savedHotel = await createHotel(req.body);
    res.status(201).json({
      message: "Hotel added successfully.",
      hotel: savedHotel
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to add hotel" });
  }
});
const getAllHotels = async () => {
  const hotels = await Hotel.find();
  return hotels;
};
app.get("/hotels", async (req, res) => {
  try {
    const hotels = await getAllHotels();
    if (hotels.length > 0) {
      res.json(hotels);
    } else {
      res.status(404).json({ error: "No hotels found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch hotels." });
  }
});

// 4. Read hotel by name
const getHotelByName = async (hotelName) => {
  const hotel = await Hotel.findOne({ name: hotelName });
  return hotel;
};
app.get("/hotels/name/:name", async (req, res) => {
  try {
    const hotel = await getHotelByName(req.params.name);
    if (hotel) {
      res.json(hotel);
    } else {
      res.status(404).json({ error: "Hotel not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch hotel." });
  }
});
// 7. Hotels by category
const getHotelsByCategory = async (category) => {
  const hotels = await Hotel.find({ category });
   return hotels;
};
app.get("/hotels/category/:hotelCategory", async (req, res) => {
  try {
    const hotels = await getHotelsByCategory(req.params.hotelCategory);
    if (hotels.length > 0) {
      res.json(hotels);
    } else {
      res.status(404).json({ error: "No hotels found with that category." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch hotels by category." });
  }
});
// 9. Hotels by rating
const getHotelsByRating = async (rating) => {
  const hotels = await Hotel.find({ rating });
  return hotels;
};
app.get("/hotels/rating/:hotelRating", async (req, res) => {
  try {
    const hotels = await getHotelsByRating(req.params.hotelRating);
    if (hotels.length > 0) {
      res.json(hotels);
    } else {
      res.status(404).json({ error: "No hotels found with that rating." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch hotels by rating." });
  }
});
// 10. Hotel by phone number
const getHotelByPhone = async (phone) => {
  const hotel = await Hotel.findOne({ phoneNumber: phone });
  return hotel;
};
app.get("/hotels/directory/:phoneNumber", async (req, res) => {
  try {
    const hotel = await getHotelByPhone(req.params.phoneNumber);
    if (hotel) {
      res.json(hotel);
    } else {
      res.status(404).json({ error: "No hotel found with that phone number." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch hotel by phone." });
  }
});

async function updateHotelById(hotelId, updatedData) {
  try {
    const updatedHotel = await Hotel.findByIdAndUpdate(hotelId, updatedData, { new: true });
    return updatedHotel;
  } catch (error) {
    console.error("Error updating hotel by ID:", error);
  }
}
app.post("/hotels/:hotelId", async (req, res) => {
  try {
    const updatedHotel = await updateHotelById(req.params.hotelId, req.body);

    if (updatedHotel) {
      res.status(200).json({
        message: "Hotel updated successfully.",
        updatedHotel: updatedHotel,
      });
    } else {
      res.status(404).json({ error: "Hotel not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update hotel." });
  }
});

async function updateHotelByName(hotelName, updatedData) {
  try {
    const updatedHotel = await Hotel.findOneAndUpdate({ name: hotelName }, updatedData, { new: true });
    console.log("Updated Hotel by Name:", updatedHotel);
  } catch (error) {
    console.error("Error updating hotel by name:", error);
  }
}
//updateHotelByName("Sunset Resort", { rating: 4.2 });
async function updateHotelByPhone(phoneNumber, updatedData) {
  try {
    const updatedHotel = await Hotel.findOneAndUpdate({ phoneNumber }, updatedData, { new: true });
    console.log("Updated Hotel by Phone:", updatedHotel);
  } catch (error) {
    console.error("Error updating hotel by phone:", error);
  }
}
//updateHotelByPhone("+1299655890", { phoneNumber: "+1997687392" });
// Function to delete hotel by ID
async function deleteHotelById(hotelId) {
  try {
    const deletedHotel = await Hotel.findByIdAndDelete(hotelId);
    if (deletedHotel) {
      return deletedHotel;
    } else {
      console.log("No hotel found with the given ID.");
    }
  } catch (error) {
    console.error("Error deleting hotel by ID:", error);
  }
}

// Route to handle delete request
app.delete("/hotels/:hotelId", async (req, res) => {
  try {
    const deletedHotel = await deleteHotelById(req.params.hotelId);
    if (deletedHotel) {
      res.status(200).json({ message: "Hotel deleted successfully." });
    } else {
      res.status(404).json({ error: "Hotel not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete hotel." });
  }
});


async function deleteHotelByPhoneNumber(phoneNumber) {
  try {
    const deletedHotel = await Hotel.findOneAndDelete({ phoneNumber: phoneNumber });
    if (deletedHotel) {
      console.log("Hotel deleted successfully:", deletedHotel);
    } else {
      console.log("No hotel found with the given phone number.");
    }
  } catch (error) {
    console.error("Error deleting hotel by phone number:", error);
  }
}

//deleteHotelByPhoneNumber("+1234555890");
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});




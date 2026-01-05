// Spas Constants

export const ITEMS_PER_PAGE = 15;

export const ADDRESS_FIELDS = [
  { key: "state", required: true },
  { key: "city", required: true },
  { key: "district", required: true },
  { key: "pincode", required: true }
];

export const INITIAL_FORM_DATA = {
  name: "",
  address: { state: "", city: "", district: "", pincode: "" },
  fullAddress: "",
  phone: "",
  email: "",
  website: "",
  logo: "",
  openingHours: "",
  closingHours: "",
  rating: 0,
  reviews: 0,
  geolocation: {
    type: "Point",
    coordinates: [null, null] // [longitude, latitude]
  },
  googleMap: "",
  direction: "",
  isActive: true,
  galleryImages: [],
};


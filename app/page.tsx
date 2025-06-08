"use client"

import type React from "react"

import { useState } from "react"
import { Plus, Search, MapPin, Tag, Star, Save, Bed, Bath, Square } from "lucide-react"

interface Property {
  id: number
  name: string
  location: string
  price: number
  size: number
  rating: number
  image: string
  description: string
  bedrooms?: number
  bathrooms?: number
}

const initialProperties: Property[] = [
  {
    id: 101,
    name: "Oceanview Villa",
    location: "Malibu, California",
    price: 4500000,
    size: 4500,
    rating: 4.8,
    bedrooms: 5,
    bathrooms: 4,
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    description:
      "Stunning modern villa with panoramic ocean views. Features infinity pool, home theater, and smart home system.",
  },
  {
    id: 102,
    name: "Downtown Penthouse",
    location: "New York, NY",
    price: 3200000,
    size: 3200,
    rating: 4.6,
    bedrooms: 3,
    bathrooms: 3,
    image:
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    description:
      "Luxury penthouse in the heart of Manhattan. Floor-to-ceiling windows, private rooftop terrace, and 24/7 concierge.",
  },
  {
    id: 103,
    name: "Mountain Retreat",
    location: "Aspen, Colorado",
    price: 2800000,
    size: 5200,
    rating: 4.9,
    bedrooms: 6,
    bathrooms: 5,
    image:
      "https://images.unsplash.com/photo-1519643381401-22c77e60520e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    description:
      "Rustic luxury in the Rocky Mountains. Features ski-in/ski-out access, heated floors, and a private hot tub.",
  },
  {
    id: 104,
    name: "Historic Mansion",
    location: "Charleston, South Carolina",
    price: 3800000,
    size: 6800,
    rating: 4.7,
    bedrooms: 7,
    bathrooms: 6,
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    description:
      "Exquisitely restored antebellum mansion with modern amenities. Formal gardens, carriage house, and original details.",
  },
  {
    id: 105,
    name: "Beachfront Estate",
    location: "Miami, Florida",
    price: 5200000,
    size: 5800,
    rating: 4.9,
    bedrooms: 8,
    bathrooms: 7,
    image:
      "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    description: "Ultra-luxury beachfront compound with private dock, tennis court, and spa facilities.",
  },
]

export default function LuxuryRealEstate() {
  const [activeSection, setActiveSection] = useState("add-property")
  const [properties, setProperties] = useState<Property[]>(initialProperties)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [searchResults, setSearchResults] = useState<Property[]>([])
  const [recentlyAddedProperties, setRecentlyAddedProperties] = useState<Property[]>([])

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 5000)
  }

  const handleAddProperty = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const newProperty: Property = {
      id: Number(formData.get("id")),
      name: formData.get("name") as string,
      location: formData.get("location") as string,
      price: Number(formData.get("price")),
      size: Number(formData.get("size")),
      rating: Number(formData.get("rating")),
      bedrooms: Number(formData.get("bedrooms")) || undefined,
      bathrooms: Number(formData.get("bathrooms")) || undefined,
      image: "/placeholder.svg?height=200&width=300",
      description: (formData.get("description") as string) || "",
    }

    // Check if ID already exists in recently added properties
    if (recentlyAddedProperties.find((p) => p.id === newProperty.id)) {
      showMessage("error", "Property ID already exists!")
      return
    }

    // Remove this line:
    // setProperties([...properties, newProperty])

    // Keep only this line:
    setRecentlyAddedProperties([...recentlyAddedProperties, newProperty])
    showMessage("success", "Property added successfully!")
    e.currentTarget.reset()
  }

  const handleSearchById = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const id = Number(formData.get("searchId"))

    const property = recentlyAddedProperties.find((p) => p.id === id)
    if (property) {
      setSelectedProperty(property)
      setMessage(null)
    } else {
      setSelectedProperty(null)
      showMessage("error", "Property not found! Please add properties first.")
    }
  }

  const handleSearchByLocation = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const location = (formData.get("location") as string).toLowerCase()

    const results = recentlyAddedProperties.filter((p) => p.location.toLowerCase().includes(location))
    setSearchResults(results)
  }

  const handleSearchByPrice = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const minPrice = Number(formData.get("minPrice"))
    const maxPrice = Number(formData.get("maxPrice"))

    const results = recentlyAddedProperties.filter((p) => p.price >= minPrice && p.price <= maxPrice)
    setSearchResults(results)
  }

  const handleTopRated = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const count = Number(formData.get("count"))

    const results = [...recentlyAddedProperties].sort((a, b) => b.rating - a.rating).slice(0, count)
    setSearchResults(results)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const PropertyCard = ({ property }: { property: Property }) => (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="h-48 bg-gray-300 bg-cover bg-center" style={{ backgroundImage: `url(${property.image})` }} />
      <div className="p-5">
        <h3 className="text-xl font-semibold text-slate-800 mb-2">{property.name}</h3>
        <div className="flex items-center text-gray-600 mb-2">
          <MapPin className="w-4 h-4 mr-2" />
          {property.location}
        </div>
        <div className="text-2xl font-bold text-red-600 mb-2">{formatPrice(property.price)}</div>
        <div className="flex justify-between items-center mb-3">
          {property.bedrooms && (
            <span className="flex items-center text-sm text-gray-600">
              <Bed className="w-4 h-4 mr-1 text-blue-500" />
              {property.bedrooms}
            </span>
          )}
          {property.bathrooms && (
            <span className="flex items-center text-sm text-gray-600">
              <Bath className="w-4 h-4 mr-1 text-blue-500" />
              {property.bathrooms}
            </span>
          )}
          <span className="flex items-center text-sm text-gray-600">
            <Square className="w-4 h-4 mr-1 text-blue-500" />
            {property.size.toLocaleString()} sqft
          </span>
        </div>
        <div className="inline-block bg-green-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
          ⭐ {property.rating}
        </div>
      </div>
    </div>
  )

  const PropertyDetail = ({ property }: { property: Property }) => (
    <div className="bg-white rounded-lg p-8 shadow-lg">
      <div className="flex justify-between items-start mb-5">
        <h2 className="text-3xl font-bold text-slate-800">{property.name}</h2>
        <div className="text-3xl font-bold text-red-600">{formatPrice(property.price)}</div>
      </div>

      <div className="flex items-center text-lg mb-5">
        <MapPin className="w-5 h-5 mr-2 text-gray-600" />
        {property.location}
      </div>

      <div
        className="w-full h-96 bg-gray-300 bg-cover bg-center rounded-lg mb-5"
        style={{ backgroundImage: `url(${property.image})` }}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-100 p-4 rounded-lg text-center">
          <div className="text-sm text-gray-600 mb-1">Size</div>
          <div className="text-xl font-semibold text-slate-800">{property.size.toLocaleString()} sqft</div>
        </div>
        {property.bedrooms && (
          <div className="bg-gray-100 p-4 rounded-lg text-center">
            <div className="text-sm text-gray-600 mb-1">Bedrooms</div>
            <div className="text-xl font-semibold text-slate-800">{property.bedrooms}</div>
          </div>
        )}
        {property.bathrooms && (
          <div className="bg-gray-100 p-4 rounded-lg text-center">
            <div className="text-sm text-gray-600 mb-1">Bathrooms</div>
            <div className="text-xl font-semibold text-slate-800">{property.bathrooms}</div>
          </div>
        )}
        <div className="bg-gray-100 p-4 rounded-lg text-center">
          <div className="text-sm text-gray-600 mb-1">Rating</div>
          <div className="text-xl font-semibold text-slate-800">⭐ {property.rating}</div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-3">Description</h3>
        <p className="text-gray-700 leading-relaxed">{property.description}</p>
      </div>

      <button onClick={() => setSelectedProperty(null)} className="text-blue-500 hover:underline font-semibold">
        ← Back to search
      </button>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-800 to-blue-600 text-white py-8 rounded-b-lg shadow-lg mb-8">
        <div className="max-w-6xl mx-auto px-5 text-center">
          <h1 className="text-4xl font-bold mb-3">Luxury Real Estate Management</h1>
          <p className="text-xl opacity-90">Find and manage premium properties worldwide</p>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-5">
        {/* Navigation Menu */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {[
            { id: "add-property", label: "Add Property", icon: Plus },
            { id: "get-property", label: "Find by ID", icon: Search },
            { id: "search-location", label: "Search by Location", icon: MapPin },
            { id: "search-price", label: "Search by Price", icon: Tag },
            { id: "top-rated", label: "Top Rated", icon: Star },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => {
                setActiveSection(id)
                setMessage(null)
                setSelectedProperty(null)
                setSearchResults([])
                // Don't clear recentlyAddedProperties when switching sections
              }}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1 ${
                activeSection === id ? "bg-red-500 text-white" : "bg-blue-500 text-white hover:bg-slate-800"
              }`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </button>
          ))}
        </div>

        {/* Message Display */}
        {message && (
          <div
            className={`p-4 rounded-lg mb-6 ${
              message.type === "success"
                ? "bg-green-100 text-green-800 border border-green-200"
                : "bg-red-100 text-red-800 border border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Add Property Section */}
        {activeSection === "add-property" && (
          <section className="bg-white rounded-lg p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 pb-3 border-b-2 border-gray-200 flex items-center gap-2">
              <Plus className="w-6 h-6" />
              Add New Property
            </h2>
            <form onSubmit={handleAddProperty} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Property ID</label>
                  <input
                    type="number"
                    name="id"
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Property Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    name="location"
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Price ($)</label>
                  <input
                    type="number"
                    name="price"
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Size (sqft)</label>
                  <input
                    type="number"
                    name="size"
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Rating (0-5)</label>
                  <input
                    type="number"
                    name="rating"
                    min="0"
                    max="5"
                    step="0.1"
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Bedrooms</label>
                  <input
                    type="number"
                    name="bedrooms"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Bathrooms</label>
                  <input
                    type="number"
                    name="bathrooms"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              <button
                type="submit"
                className="bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors flex items-center gap-2"
              >
                <Save className="w-5 h-5" />
                Add Property
              </button>
            </form>
            {recentlyAddedProperties.length > 0 && (
              <div className="mt-8 pt-8 border-t-2 border-gray-200">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-green-500" />
                  Recently Added Properties ({recentlyAddedProperties.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recentlyAddedProperties.map((property, index) => (
                    <div key={property.id} className="bg-green-50 border border-green-200 rounded-lg p-4 relative">
                      <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                        #{recentlyAddedProperties.length - index}
                      </div>
                      <div
                        className="h-32 bg-gray-300 bg-cover bg-center rounded-lg mb-3"
                        style={{ backgroundImage: `url(${property.image})` }}
                      />
                      <h4 className="text-lg font-bold text-slate-800 mb-1">{property.name}</h4>
                      <div className="flex items-center text-gray-600 mb-2 text-sm">
                        <MapPin className="w-3 h-3 mr-1" />
                        {property.location}
                      </div>
                      <div className="text-lg font-bold text-red-600 mb-2">{formatPrice(property.price)}</div>

                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <div className="bg-white p-2 rounded text-center text-xs">
                          <div className="text-gray-600">Size</div>
                          <div className="font-semibold">{property.size.toLocaleString()} sqft</div>
                        </div>
                        <div className="bg-white p-2 rounded text-center text-xs">
                          <div className="text-gray-600">Rating</div>
                          <div className="font-semibold">⭐ {property.rating}</div>
                        </div>
                        {property.bedrooms && (
                          <div className="bg-white p-2 rounded text-center text-xs">
                            <div className="text-gray-600">Bedrooms</div>
                            <div className="font-semibold">{property.bedrooms}</div>
                          </div>
                        )}
                        {property.bathrooms && (
                          <div className="bg-white p-2 rounded text-center text-xs">
                            <div className="text-gray-600">Bathrooms</div>
                            <div className="font-semibold">{property.bathrooms}</div>
                          </div>
                        )}
                      </div>

                      {property.description && (
                        <div className="text-gray-700 text-sm line-clamp-2">{property.description}</div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-blue-800 text-sm">
                    <strong>Total Properties Added This Session:</strong> {recentlyAddedProperties.length}
                  </p>
                </div>
              </div>
            )}
          </section>
        )}

        {/* Get Property by ID Section */}
        {activeSection === "get-property" && (
          <section className="bg-white rounded-lg p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 pb-3 border-b-2 border-gray-200 flex items-center gap-2">
              <Search className="w-6 h-6" />
              Find Property by ID
            </h2>
            {recentlyAddedProperties.length === 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-yellow-800">
                  <strong>No properties available!</strong> Please add some properties first using the "Add Property"
                  section.
                </p>
              </div>
            )}
            <form onSubmit={handleSearchById} className="mb-8">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Enter Property ID</label>
                  <input
                    type="number"
                    name="searchId"
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-800 transition-colors flex items-center gap-2"
                  >
                    <Search className="w-5 h-5" />
                    Search
                  </button>
                </div>
              </div>
            </form>

            {selectedProperty && <PropertyDetail property={selectedProperty} />}
          </section>
        )}

        {/* Search by Location Section */}
        {activeSection === "search-location" && (
          <section className="bg-white rounded-lg p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 pb-3 border-b-2 border-gray-200 flex items-center gap-2">
              <MapPin className="w-6 h-6" />
              Search Properties by Location
            </h2>
            {recentlyAddedProperties.length === 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-yellow-800">
                  <strong>No properties available!</strong> Please add some properties first using the "Add Property"
                  section.
                </p>
              </div>
            )}
            <form onSubmit={handleSearchByLocation} className="mb-8">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Enter Location</label>
                  <input
                    type="text"
                    name="location"
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-800 transition-colors flex items-center gap-2"
                  >
                    <Search className="w-5 h-5" />
                    Search
                  </button>
                </div>
              </div>
            </form>

            {searchResults.length > 0 && (
              <div>
                <p className="text-gray-600 mb-5 italic">Found {searchResults.length} properties</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchResults.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Search by Price Section */}
        {activeSection === "search-price" && (
          <section className="bg-white rounded-lg p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 pb-3 border-b-2 border-gray-200 flex items-center gap-2">
              <Tag className="w-6 h-6" />
              Search Properties by Price Range
            </h2>
            {recentlyAddedProperties.length === 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-yellow-800">
                  <strong>No properties available!</strong> Please add some properties first using the "Add Property"
                  section.
                </p>
              </div>
            )}
            <form onSubmit={handleSearchByPrice} className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Minimum Price ($)</label>
                  <input
                    type="number"
                    name="minPrice"
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Maximum Price ($)</label>
                  <input
                    type="number"
                    name="maxPrice"
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                  >
                    <Search className="w-5 h-5" />
                    Search
                  </button>
                </div>
              </div>
            </form>

            {searchResults.length > 0 && (
              <div>
                <p className="text-gray-600 mb-5 italic">Found {searchResults.length} properties</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchResults.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Top Rated Properties Section */}
        {activeSection === "top-rated" && (
          <section className="bg-white rounded-lg p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 pb-3 border-b-2 border-gray-200 flex items-center gap-2">
              <Star className="w-6 h-6" />
              Top Rated Properties
            </h2>
            {recentlyAddedProperties.length === 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-yellow-800">
                  <strong>No properties available!</strong> Please add some properties first using the "Add Property"
                  section.
                </p>
              </div>
            )}
            <form onSubmit={handleTopRated} className="mb-8">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Number of Properties to Display
                  </label>
                  <input
                    type="number"
                    name="count"
                    min="1"
                    defaultValue="5"
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-800 transition-colors flex items-center gap-2"
                  >
                    <Search className="w-5 h-5" />
                    Show Top Properties
                  </button>
                </div>
              </div>
            </form>

            {searchResults.length > 0 && (
              <div>
                <p className="text-gray-600 mb-5 italic">Showing top {searchResults.length} rated properties</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchResults.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              </div>
            )}
          </section>
        )}
      </div>

      {/* Footer */}
      <footer className="text-center py-8 mt-12 text-gray-600 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-5">
          <p>&copy; 2023 Luxury Real Estate Management System. All rights reserved.</p>
          <p className="mt-2">Powered by Advanced Property Technology</p>
        </div>
      </footer>
    </div>
  )
}

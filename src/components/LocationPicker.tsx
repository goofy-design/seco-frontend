import React, { useRef, useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

type LatLng = {
  lat: number;
  lng: number;
};

interface LocationPickerProps {
  locationSelect: {
    lat: number;
    lng: number;
    address: string;
    buildingName: string;
  };
  onLocationSelect: (location: {
    lat: number;
    lng: number;
    address: string;
    buildingName: string;
  }) => void;
}

const containerStyle: React.CSSProperties = {
  width: "100%",
  height: "300px",
};

const defaultCenter: LatLng = {
  lat: 19.076, // Mumbai
  lng: 72.8777,
};

const LocationPicker: React.FC<LocationPickerProps> = ({
  locationSelect,
  onLocationSelect,
}) => {
  const [markerPosition, setMarkerPosition] = useState<LatLng | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [displayValue, setDisplayValue] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [predictions, setPredictions] = useState<
    google.maps.places.AutocompletePrediction[]
  >([]);
  const [placesService, setPlacesService] =
    useState<google.maps.places.PlacesService | null>(null);
  const autocompleteService =
    useRef<google.maps.places.AutocompleteService | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Format location display with building name in bold
  const formatLocationDisplay = (buildingName: string, address: string) => {
    if (buildingName && buildingName !== address) {
      return `${buildingName}, ${address}`;
    }
    return address;
  };

  // Parse prediction description to extract building name and address
  const parsePredictionDescription = (description: string) => {
    const parts = description.split(", ");
    if (parts.length >= 2) {
      const buildingName = parts[0];
      const address = parts.slice(1).join(", ");
      return { buildingName, address };
    }
    return { buildingName: "", address: description };
  };

  // Render formatted input value with building name in bold
  const renderInputValue = (value: string) => {
    const { buildingName, address } = parsePredictionDescription(value);

    if (buildingName && address) {
      return (
        <>
          <span className="font-bold text-gray-900">{buildingName}</span>
          <span className="text-gray-500">, {address}</span>
        </>
      );
    }
    return <span className="text-gray-900">{value}</span>;
  };

  // Render formatted location text for dropdown
  const renderLocationText = (description: string) => {
    const { buildingName, address } = parsePredictionDescription(description);

    if (buildingName && address) {
      return (
        <>
          <span className="font-bold">{buildingName}</span>
          <span className="text-gray-500">, {address}</span>
        </>
      );
    }
    return <span>{description}</span>;
  };

  // Prefill marker and input if locationSelect is provided
  useEffect(() => {
    if (locationSelect && locationSelect.lat && locationSelect.lng) {
      setMarkerPosition({ lat: locationSelect.lat, lng: locationSelect.lng });
      const formattedValue = formatLocationDisplay(
        locationSelect.buildingName || "",
        locationSelect.address || ""
      );
      setInputValue(formattedValue);
      setDisplayValue(formattedValue);
    }
  }, [locationSelect]);

  // Initialize services when Google Maps loads
  const handleMapLoad = (map: google.maps.Map) => {
    setPlacesService(new google.maps.places.PlacesService(map));
    autocompleteService.current = new google.maps.places.AutocompleteService();
  };

  // Handle input changes and fetch predictions
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setIsEditing(true);

    if (value.trim() && autocompleteService.current) {
      const request = {
        input: value,
        componentRestrictions: { country: "in" }, // Restrict to India, you can remove or change this
      };

      autocompleteService.current.getPlacePredictions(
        request,
        (predictions, status) => {
          if (
            status === google.maps.places.PlacesServiceStatus.OK &&
            predictions
          ) {
            setPredictions(predictions);
            setShowDropdown(true);
          } else {
            setPredictions([]);
            setShowDropdown(value.trim().length > 0);
          }
        }
      );
    } else {
      setPredictions([]);
      setShowDropdown(false);
    }
  };

  // Handle Enter key for custom location
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (predictions.length === 0 && inputValue.trim()) {
        handleCustomLocation(inputValue.trim());
      }
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setShowDropdown(false);
    }
  };

  // Handle selection from dropdown
  const handlePlaceSelect = (placeId: string | null, description?: string) => {
    if (!placeId) {
      // Custom location
      handleCustomLocation(description || inputValue);
      return;
    }

    if (placesService) {
      const request = {
        placeId: placeId,
        fields: ["name", "formatted_address", "geometry"],
      };

      placesService.getDetails(request, (place, status) => {
        if (
          status === google.maps.places.PlacesServiceStatus.OK &&
          place?.geometry?.location
        ) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();

          const buildingName = place.name || "";
          const fullAddress = place.formatted_address || "";
          const formattedValue = formatLocationDisplay(
            buildingName,
            fullAddress
          );

          setMarkerPosition({ lat, lng });
          setInputValue(formattedValue);
          setDisplayValue(formattedValue);
          setShowDropdown(false);
          setIsEditing(false);

          onLocationSelect({
            lat,
            lng,
            address: fullAddress,
            buildingName,
          });
        }
      });
    }
  };

  // Handle custom location input
  const handleCustomLocation = (customInput: string) => {
    // For custom location, set default coordinates (you can modify this logic)
    const customLocation = {
      lat: defaultCenter.lat,
      lng: defaultCenter.lng,
      address: customInput,
      buildingName: customInput,
    };

    setMarkerPosition({ lat: customLocation.lat, lng: customLocation.lng });
    setInputValue(customInput);
    setDisplayValue(customInput);
    setShowDropdown(false);
    setIsEditing(false);

    onLocationSelect(customLocation);
  };

  // Handle clicks outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API}
      libraries={["places"]}
    >
      <div className="relative w-full">
        {/* Custom formatted input display */}
        <div className="relative">
          {!isEditing ? (
            <div
              className="w-full mb-4 rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[40px] flex items-center cursor-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              onClick={() => setIsEditing(true)}
            >
              {displayValue ? (
                renderInputValue(displayValue)
              ) : (
                <span className="text-muted-foreground">Enter a location</span>
              )}
            </div>
          ) : (
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onBlur={() => {
                if (!showDropdown) {
                  setIsEditing(false);
                }
              }}
              placeholder="Enter a location"
              className="w-full mb-4 rounded-md border border-input bg-background px-3 py-2 text-sm text-gray-900 placeholder:text-muted-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              autoComplete="off"
              autoFocus
            />
          )}
        </div>

        {showDropdown && (
          <div
            ref={dropdownRef}
            className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto"
            style={{ marginTop: "-1rem" }}
          >
            {predictions.map((prediction) => (
              <div
                key={prediction.place_id}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                onClick={() =>
                  handlePlaceSelect(prediction.place_id, prediction.description)
                }
              >
                <div className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-2 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="text-sm text-gray-900">
                    {renderLocationText(prediction.description)}
                  </span>
                </div>
              </div>
            ))}

            {inputValue.trim() && (
              <div
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0 bg-blue-50"
                onClick={() => handlePlaceSelect(null, inputValue.trim())}
              >
                <div className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-2 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  <span className="text-sm text-blue-600 font-medium">
                    Add "{inputValue.trim()}"
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={markerPosition || defaultCenter}
        zoom={markerPosition ? 15 : 10}
        onLoad={handleMapLoad}
      >
        {markerPosition && <Marker position={markerPosition} />}
      </GoogleMap>
    </LoadScript>
  );
};

export default LocationPicker;

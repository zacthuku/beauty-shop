import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Calendar,
  MapPin,
  Phone,
  Edit,
  Save,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  });

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleSave = () => {

    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully.",
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      username: user?.username || "",
      email: user?.email || "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
    });
    setIsEditing(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDeleteAccount = () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
   
      logout();
      toast({
        title: "Account deleted",
        description: "Your account has been deleted successfully.",
      });
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {user.username}
                  </h1>
                  <p className="text-gray-600">{user.email}</p>
                  <p className="text-sm text-gray-500">
                    Member since {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                {isEditing ? (
                  <>
                    <Button variant="outline" onClick={handleCancel}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSave}
                      className="bg-rose-500 hover:bg-rose-600"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditing(true)} variant="outline">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Personal Information */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Personal Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                  {isEditing ? (
                    <Input
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                    />
                  ) : (
                    <div className="flex items-center space-x-3">
                      <User className="h-5 w-5 text-gray-400" />
                      <span>{user.username}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  {isEditing ? (
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  ) : (
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <span>{user.email}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  {isEditing ? (
                    <Input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter phone number"
                    />
                  ) : (
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-500">Not provided</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Member Since
                  </label>
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Address Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address
                  </label>
                  {isEditing ? (
                    <Input
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Enter street address"
                    />
                  ) : (
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-500">Not provided</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    {isEditing ? (
                      <Input
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="City"
                      />
                    ) : (
                      <span className="text-gray-500">Not provided</span>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State
                    </label>
                    {isEditing ? (
                      <Input
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        placeholder="State"
                      />
                    ) : (
                      <span className="text-gray-500">Not provided</span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ZIP Code
                  </label>
                  {isEditing ? (
                    <Input
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      placeholder="ZIP Code"
                    />
                  ) : (
                    <span className="text-gray-500">Not provided</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Account Actions */}
          <div className="bg-white rounded-lg p-6 shadow-sm mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Account Actions
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">Change Password</h3>
                  <p className="text-sm text-gray-500">
                    Update your account password
                  </p>
                </div>
                <Button variant="outline">Change Password</Button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">Download Data</h3>
                  <p className="text-sm text-gray-500">
                    Download a copy of your account data
                  </p>
                </div>
                <Button variant="outline">Download</Button>
              </div>

              <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                <div>
                  <h3 className="font-medium text-red-900">Delete Account</h3>
                  <p className="text-sm text-red-600">
                    Permanently delete your account and data
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={handleDeleteAccount}
                  className="border-red-300 text-red-600 hover:bg-red-100"
                >
                  Delete Account
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

import React, { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetails, purchasePlan } from "@/redux/userSlice";
import "../../App.css";
import Header from "@/pages/Header";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datepicker";
// Spinner component
// const Spinner = () => (
//   <div className="inline-block w-4 h-4 border-2 border-white rounded-full spinner-border animate-spin border-t-transparent"></div>
// );

// Spinner Component using Tailwind CSS
const Spinner = () => (
  <svg
    className="w-5 h-5 text-white animate-spin"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v8H4z"
    ></path>
  </svg>
);
export function PurchasePlanPage() {
  const { plans } = useSelector((state) => state.admin);
  const { user } = useSelector((state) => state.user);
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const selectedPlan = plans.find((plan) => plan._id === id);

  const [paymentInfo, setPaymentInfo] = useState({
    planId: id,
    paymentMethod: "credit_card",
    amount: "",
    planFee: selectedPlan.price,
    paymentDetails: {
      cardNumber: "",
      expirationDate: "",
      cvv: "",
      name: "",
      zip: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errors, setErrors] = useState({});

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setPaymentInfo((prev) => ({
  //     ...prev,
  //     paymentDetails: {
  //       ...prev.paymentDetails,
  //       [name]: value,
  //     },
  //   }));
  // };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentInfo((prev) => {
      // If the field is part of paymentDetails
      if (
        ["cardNumber", "expirationDate", "cvv", "name", "zip"].includes(name)
      ) {
        return {
          ...prev,
          paymentDetails: {
            ...prev.paymentDetails,
            [name]: value,
          },
        };
      }
      // Otherwise, update top-level fields
      return {
        ...prev,
        [name]: value,
      };
    });
  };
  // validate the plan purchase validation :
  const validateForm = () => {
    const newErrors = {};
    const { cardNumber, expirationDate, cvv, name, zip } =
      paymentInfo.paymentDetails;

    // Validate Card Number (should be 16 digits)
    if (!/^\d{16}$/.test(cardNumber)) {
      newErrors.cardNumber = "Card number must be 16 digits.";
    }

    // Validate Expiry Date (should be in MM/YY format and valid date)
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expirationDate)) {
      newErrors.expirationDate = "Expiry date must be in MM/YY format.";
    }

    // Validate CVV (should be 3 or 4 digits)
    if (!/^\d{3,4}$/.test(cvv)) {
      newErrors.cvv = "CVC must be 3 or 4 digits.";
    }

    // Validate Name on Card (should not be empty)
    if (name.trim() === "") {
      newErrors.name = "Name on card is required.";
    }

    // Validate Zip Code (should be 5 digits)
    if (!/^\d{5}$/.test(zip)) {
      newErrors.zip = "Zip code must be 5 digits.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePaymentMethodChange = (value) => {
    setPaymentInfo({
      ...paymentInfo,
      paymentMethod: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (validateForm()) {
        setLoading(true);
        console.log("paymentInfo before submit:", paymentInfo); // Add this
        const result = await dispatch(purchasePlan(paymentInfo)).unwrap();

        setLoading(false);

        if (result.success) {
          setShowThankYou(true);
          dispatch(getUserDetails());
          // setTimeout(() => {
            navigate("/member-dashboard");
          // }, 100);
        } else {
          setErrorMessage(
            result.message || "Payment failed. Please try again."
          );
          toast.error(result.message || "Payment failed. Please try again.");
        }
      } else {
        toast.error("Plan Info. Not Validated");
      }
    } catch (error) {
      setLoading(false);
      const errorMessage =
        error.message || "An error occurred. Please try again.";
      setErrorMessage(errorMessage);
      toast.error(errorMessage);
      console.log("Error processing payment:", error);
    }
  };

  if (!selectedPlan) {
    return <p>Plan Not Found</p>;
  }

  const paymentMethods = [
    { value: "credit_card", label: "Credit Card" },
    { value: "debit_card", label: "Debit Card" },
    { value: "paypal", label: "PayPal" },
    { value: "bank_transfer", label: "Bank Transfer" },
    { value: "upi", label: "UPI" },
  ];
  return (
    <div className="min-w-[80dvw] flex flex-col bg-gradient-to-br from-gray-900 to-black min-h-[100dvh] mt-[-2px]">
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="flex flex-col items-center">
            <Spinner />
            <span className="mt-4 text-white">Processing...</span>
          </div>
        </div>
      )}
      <Header user={user} />
      <div className="w-full max-w-4xl px-6 py-12 mx-auto md:py-16 md:px-8">
        {showThankYou && (
          <div className="popup-message">
            <p>Thank you for your purchase!</p>
          </div>
        )}
        {errorMessage && (
          <div className="p-4 mb-6 text-sm text-red-600 bg-red-100 rounded-lg">
            {errorMessage}
          </div>
        )}
        <div className="grid gap-8 md:grid-cols-2">
          {/* Plan Details Section */}
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">Purchase Plan</h1>
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-2xl text-white">
                  {selectedPlan.name}
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Unlock full access to our gym facilities and services.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-4xl font-bold text-white">
                      ₹{selectedPlan.price}
                    </div>
                    <div className="text-sm text-gray-400">per month</div>
                  </div>
                  <Button
                    variant="secondary"
                    onClick={() => navigate("/")}
                    className="text-white bg-gray-700 hover:bg-gray-600"
                  >
                    Change Plan
                  </Button>
                </div>
                <Separator className="bg-gray-700" />
                <div className="grid gap-3">
                  {[
                    "Unlimited access to gym",
                    "Free personal training sessions",
                    "Discounts on supplements",
                    "Access to exclusive events",
                  ].map((benefit, index) => (
                    <div className="flex items-center gap-3" key={index}>
                      <CheckIcon className="w-5 h-5 text-blue-500" />
                      <span className="text-gray-300">{benefit}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Details Section */}
          <div className="grid gap-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-2xl text-white">
                  Payment Details
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Enter your payment information to complete your purchase.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="grid gap-6" onSubmit={handleSubmit}>
                  {/* Name on Card */}
                  <div className="grid gap-2">
                    <Label htmlFor="name" className="text-gray-300">
                      Name on Card
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your name"
                      name="name"
                      required
                      onChange={handleInputChange}
                      value={paymentInfo.paymentDetails.name}
                      className="text-white placeholder-gray-400 bg-gray-700 border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500">{errors.name}</p>
                    )}
                  </div>

                  {/* Card Number */}
                  <div className="grid gap-2">
                    <Label htmlFor="cardNumber" className="text-gray-300">
                      Card Number
                    </Label>
                    <Input
                      id="cardNumber"
                      name="cardNumber"
                      type="text"
                      placeholder="0000 0000 0000 0000"
                      required
                      value={paymentInfo.paymentDetails.cardNumber}
                      onChange={handleInputChange}
                      className="text-white placeholder-gray-400 bg-gray-700 border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.cardNumber && (
                      <p className="text-sm text-red-500">
                        {errors.cardNumber}
                      </p>
                    )}
                  </div>

                  {/* Amount */}
                  <div className="grid gap-2">
                    <Label htmlFor="amount" className="text-gray-300">
                      Amount
                    </Label>
                    <Input
                      id="amount"
                      name="amount"
                      type="number"
                      required
                      value={paymentInfo.amount}
                      onChange={handleInputChange}
                      disabled={loading}
                      className="text-white placeholder-gray-400 bg-gray-700 border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter amount"
                    />
                    {errors.amount && (
                      <p className="text-sm text-red-500">{errors.amount}</p>
                    )}
                  </div>

                  {/* Expiry Date, CVC, and Zip Code */}
                  <div className="grid grid-cols-3 gap-4">
                    {/* Expiry Date with Calendar  --------------*/}
                    <div className="grid gap-2">
                      <label htmlFor="expirationDate" className="text-gray-300">
                        Expiry Date
                      </label>
                      <DatePicker
                        id="expirationDate"
                        selected={
                          paymentInfo.paymentDetails.expirationDate
                            ? new Date(
                                "20" +
                                  paymentInfo.paymentDetails.expirationDate.slice(
                                    3,
                                    5
                                  ) +
                                  "-" +
                                  paymentInfo.paymentDetails.expirationDate.slice(
                                    0,
                                    2
                                  ) +
                                  "-01"
                              )
                            : null
                        }
                        onChange={(date) => {
                          const formatted =
                            String(date.getMonth() + 1).padStart(2, "0") +
                            "/" +
                            String(date.getFullYear()).slice(-2); // MM/YY format
                          handleInputChange({
                            target: {
                              name: "expirationDate",
                              value: formatted,
                            },
                          });
                        }}
                        dateFormat="MM/yyyy"
                        showMonthYearPicker
                        className="bg-gray-700 text-white border border-gray-600 rounded p-2 w-full"
                        placeholderText="Select month and year"
                      />

                      {errors.expirationDate && (
                        <p className="text-sm text-red-500">
                          {errors.expirationDate}
                        </p>
                      )}
                    </div>
                    {/* -------------- expiry date  */}
                    {/* CVC */}
                    <div className="grid gap-2">
                      <Label htmlFor="cvv" className="text-gray-300">
                        CVC
                      </Label>
                      <Input
                        id="cvv"
                        name="cvv"
                        type="text"
                        placeholder="123"
                        required
                        value={paymentInfo.paymentDetails.cvv}
                        onChange={handleInputChange}
                        className="text-white placeholder-gray-400 bg-gray-700 border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                      />
                      {errors.cvv && (
                        <p className="text-sm text-red-500">{errors.cvv}</p>
                      )}
                    </div>
                    {/* Zip Code */}
                    <div className="grid gap-2">
                      <Label htmlFor="zip" className="text-gray-300">
                        Zip Code
                      </Label>
                      <Input
                        id="zip"
                        type="text"
                        placeholder="12345"
                        required
                        name="zip"
                        onChange={handleInputChange}
                        value={paymentInfo.paymentDetails.zip}
                        className="text-white placeholder-gray-400 bg-gray-700 border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                      />
                      {errors.zip && (
                        <p className="text-sm text-red-500">{errors.zip}</p>
                      )}
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="grid gap-2">
                    <Label htmlFor="paymentMethod" className="text-gray-300">
                      Payment Method
                    </Label>
                    <Select
                      id="paymentMethod"
                      value={paymentInfo.paymentMethod}
                      onValueChange={handlePaymentMethodChange}
                    >
                      <SelectTrigger className="text-white placeholder-gray-400 bg-gray-700 border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500">
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        {paymentMethods.map((method) => (
                          <SelectItem
                            key={method.value}
                            value={method.value}
                            className="text-white hover:bg-gray-700"
                          >
                            {method.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="flex items-center justify-center mt-4 text-white transition-transform transform bg-blue-600 hover:bg-blue-700 hover:scale-105"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <Spinner /> Processing...
                      </div>
                    ) : (
                      "Purchase Plan"
                    )}
                  </Button>
                </form>
              </CardContent>
              <CardFooter>
                <Progress value={50} className="bg-gray-700" />
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function LockIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function CalendarDaysIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
      <path d="M8 14h.01" />
      <path d="M12 14h.01" />
      <path d="M16 14h.01" />
      <path d="M8 18h.01" />
      <path d="M12 18h.01" />
      <path d="M16 18h.01" />
    </svg>
  );
}

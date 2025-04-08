 
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Calendar,
  CreditCard,
  Home,
  LogOut,
  Settings,
  Users,
} from "lucide-react";
import {
  getMemberReaminingPaymentStatus,
  purchasePlan,
} from "@/redux/userSlice";
import AdminSidePanel from "@/Component/AdminSidePanel";
import MemberSidePanel from "@/Component/MemberSidePanel";

const GetMemberRemainingPaymentStatusComponent = () => {
  const [paymentInfo, setPaymentInfo] = useState({
    amount: "",
    paymentMethod: "credit_card",
    paymentDetails: { cardNumber: "" },
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch();
  const { user, payments, status, error } = useSelector((state) => state.user); // Added 'user' to get name/photo

  useEffect(() => {
    dispatch(getMemberReaminingPaymentStatus());
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePaymentMethodChange = (value) => {
    setPaymentInfo((prev) => ({
      ...prev,
      paymentMethod: value,
    }));
  };

  const handleRemainingPayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await dispatch(purchasePlan(paymentInfo)).unwrap();
      setLoading(false);
      if (result.success) {
        dispatch(getMemberReaminingPaymentStatus()); // Refresh payment status
        setErrorMessage("");
        alert("Payment recorded successfully!");
      } else {
        setErrorMessage(result.message);
      }
    } catch (error) {
      setLoading(false);
      setErrorMessage(error.message || "Payment failed. Please try again.");
    }
  };

  const handleLogout = () => {
    dispatch({ type: "user/logout" }); // Trigger logout action
  };

  if (status === "loading")
    return <div className="py-20 text-center text-slate-400">Loading...</div>;
  if (error)
    return <div className="py-20 text-center text-red-500">Error: {error}</div>;
  if (!payments)
    return (
      <div className="py-20 text-center text-slate-400">
        No payment data available
      </div>
    );

  const totalPaid = payments.totalAmount - payments.remainingAmount;

  return (
    <MemberSidePanel>
      <div className="flex flex-col min-h-screen dark bg-slate-950 mt-[-70px]">
        <div className="flex flex-col flex-1 md:flex-row">
          {/* Main content */}
          <main className="flex-1 p-6 overflow-y-auto bg-slate-900">
            <div className="max-w-6xl mx-auto space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-black">
                  Membership Dashboard
                </h1>
                <p className="text-black text-slate-400">
                  Manage your gym membership and payments
                </p>
              </div>

              {/* Payment Status */}
              <Card>
                <CardHeader>
                  <h2 className="text-2xl font-semibold tracking-tight text-white">
                    Payment Status
                  </h2>
                  <p className="mt-1 text-base text-slate-400">
                    Your current membership payment details
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <div>
                      <p className="text-sm text-slate-400">Plan Name</p>
                      <p className="text-lg font-medium text-white">
                        {payments.planName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Total Amount</p>
                      <p className="text-lg font-medium text-white">
                        ₹{payments.totalAmount}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Amount Paid</p>
                      <p className="text-lg font-medium text-white">
                        ₹{totalPaid.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">
                        Remaining Balance
                      </p>
                      <p className="text-lg font-medium text-white">
                        ₹{payments.remainingAmount}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Payment Deadline</p>
                      <p className="flex items-center text-lg font-medium text-white">
                        <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                        {payments.deadline
                          ? new Date(payments.deadline).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Status</p>
                      <p
                        className={`text-lg font-medium ${
                          payments.status === "completed"
                            ? "text-emerald-500"
                            : "text-yellow-500"
                        }`}
                      >
                        {payments.remainingAmount >0 ?  payments.status: "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Plan Expiry</p>
                      <p className="flex items-center text-lg font-medium text-white">
                        <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                        {payments.planExpiry ? new Date(payments.planExpiry).toLocaleDateString(): "N/A"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Pay Remaining Fee */}
              {payments.remainingAmount > 0 && payments.isActive && (
                <Card>
                  <CardHeader>
                    <h2 className="text-2xl font-semibold tracking-tight text-white">
                      Pay Remaining Fee
                    </h2>
                    <p className="mt-1 text-base text-slate-400">
                      Complete your payment to continue enjoying your membership
                    </p>
                  </CardHeader>
                  <CardContent>
                    <form
                      onSubmit={handleRemainingPayment}
                      className="space-y-4"
                    >
                      <div>
                        <p className="mb-2 text-sm text-slate-400">
                          Amount to Pay (Max: ₹{payments.remainingAmount})
                        </p>
                        <div className="flex items-center">
                          <span className="mr-2 text-white">₹</span>
                          <Input
                            type="number"
                            name="amount"
                            value={paymentInfo.amount}
                            onChange={handleInputChange}
                            placeholder="Enter amount"
                            max={payments.remainingAmount}
                            className="text-white border-slate-700 bg-slate-900 placeholder:text-slate-500"
                            disabled={loading}
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <p className="mb-2 text-sm text-slate-400">
                          Payment Method
                        </p>
                        <Select
                          value={paymentInfo.paymentMethod}
                          onValueChange={handlePaymentMethodChange}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="credit_card">
                              Credit Card
                            </SelectItem>
                            <SelectItem value="debit_card">
                              Debit Card
                            </SelectItem>
                            <SelectItem value="upi">UPI</SelectItem>
                            <SelectItem value="netbanking">
                              Net Banking
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <p className="mb-2 text-sm text-slate-400">
                          Card Number
                        </p>
                        <Input
                          type="text"
                          name="cardNumber"
                          value={paymentInfo.paymentDetails.cardNumber}
                          onChange={(e) =>
                            setPaymentInfo((prev) => ({
                              ...prev,
                              paymentDetails: {
                                ...prev.paymentDetails,
                                cardNumber: e.target.value,
                              },
                            }))
                          }
                          placeholder="XXXX XXXX XXXX XXXX"
                          className="text-white border-slate-700 bg-slate-900 placeholder:text-slate-500"
                          disabled={loading}
                          required
                        />
                      </div>

                      <div className="flex justify-center">
                        <Button
                          type="submit"
                          className="text-white transition-transform shadow-lg bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:scale-105"
                          disabled={loading}
                        >
                          <CreditCard className="w-4 h-4 mr-2" />
                          {loading ? "Processing..." : "Pay Now"}
                        </Button>
                      </div>

                      {errorMessage && (
                        <p className="mt-2 text-sm text-red-500">
                          {errorMessage}
                        </p>
                      )}
                    </form>
                  </CardContent>
                </Card>
              )}

              {/* Payment History */}
              {payments.paymentHistory &&
                payments.paymentHistory.length > 0 && (
                  <div>
                    {/* <h1 className="text-3xl font-semibold text-black">
                      Payment History
                    </h1>
                    <p className="mt-1 text-black dark:text-gray-400">
                      Track your previous payment transactions
                    </p> */}

<div className="mt-11">
<header className="w-full px-4 mx-auto mb-6 max-w-7xl md:px-4">
          <h1 className="text-3xl font-semibold text-black ">
          Payment History
          </h1>
          <p className="mt-1 text-black dark:text-gray-400">
          Track your previous payment transactions
          </p>
        </header>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Amount Paid</TableHead>
                          <TableHead>Remaining</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {payments.paymentHistory.map((payment, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              {new Date(
                                payment.paymentDate
                              ).toLocaleDateString()}
                            </TableCell>
                            <TableCell>₹{payment.amountPaid}</TableCell>
                            <TableCell>₹{payment.remainingAmount}</TableCell>
                            <TableCell
                              className={`text-${
                                payment.status === "completed"
                                  ? "emerald"
                                  : "yellow"
                              }-500`}
                            >
                              {payment.status}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    </div>
                  </div>
                )}
            </div>
          </main>
        </div>
      </div>
    </MemberSidePanel>
  );
};

export default GetMemberRemainingPaymentStatusComponent;

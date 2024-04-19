import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PaymentBoot from "./component/PaymentBoot";
import PaymentReact from "./component/PaymentReact";
import Success from "./component/Success";
import Failed from "./component/Failed";
import PaymentStatus from "./component/PaymentStatus";
import Dashboard from "./component";


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/payment-react" element={<PaymentReact />} />
          <Route path="/payment-boot" element={<PaymentBoot />} />
          <Route path="/payment/status/:tnxId" element={<PaymentStatus />} />
          <Route path="/success" element={<Success />} />
          <Route path="/failed" element={<Failed />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

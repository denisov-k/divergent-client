import "./index.css";
import Navigation from "@/components/web/layout/Navigation";

const Index = ({ fixed = false }) => {
  return (
    <div id="footer" className={fixed ? "fixed" : ""}>
      <Navigation />
    </div>
  );
};

export default Index;

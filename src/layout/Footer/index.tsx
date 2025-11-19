import './index.css';
import Navigation from "@/components/Navigation";

const Index = ({ fixed = false }) => {


  return (
    <div id="footer" className={ fixed ? 'fixed' : '' }>
      <Navigation></Navigation>
    </div>
  );
}

export default Index;

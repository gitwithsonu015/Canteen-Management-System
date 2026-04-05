import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import PopularFoods from "@/components/home/PopularFoods";
import Categories from "@/components/home/Categories";
import TodaysSpecial from "@/components/home/TodaysSpecial";
import HowItWorks from "@/components/home/HowItWorks";
import Testimonials from "@/components/home/Testimonials";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <PopularFoods />
        <Categories />
        <TodaysSpecial />
        <HowItWorks />
        <Testimonials />
      </main>
      <Footer />
    </>
  );
}

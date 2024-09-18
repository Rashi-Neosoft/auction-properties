// Import bootstrap react components
import { Button, Card, Container } from "react-bootstrap";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
// import required modules
import { Pagination, Navigation } from "swiper/modules";
import CountDown from "../components/functions/CountDown";
// import framer motion
import { motion } from "framer-motion";
import AnimationTitles from "../components/functions/AnimationTitles";
import { useState, useEffect } from "react";

function Properties() {
  const [properties, setProperties] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    (async() => {
      const res = await fetch("http://localhost:4000/get-properties");
      const data = await res.json();
      setCategories(getCategories(data));
      setProperties(shuffle(data));
    })();
  }, []);

  // Get unique categories
  const getCategories = (data) => Array.from(new Set(data.map(rec => rec.category)));

  // Shuffle the properties
  const shuffle = (array) => array.sort(() => Math.random() - 0.5);

  // Active on select a tab
  const active = (e) => {
    let act = document.querySelectorAll(".active");
    act[0].classList.remove("active");
    e.target.classList.add("active");
    setActiveCategory(e.target.innerText);
  }

  // Like button of properties
  const like = (e) => {
    return e.target.classList.value === "fa-regular fa-heart like"
      ? (e.target.classList.value = "fa-solid fa-heart like text-danger")
      : (e.target.classList.value = "fa-regular fa-heart like");
  }

  return properties?.length ? (
    // Start properties
    <div className="properties">
      <Container>
        <AnimationTitles
          className="title mx-auto"
          title="Discover more properties"
        />
        {/* Start tabs */}
        <div className="tabs d-flex justify-content-start justify-content-sm-center align-items-center flex-nowrap w-lg-50">
          <Swiper
            className="mySwiper overflow-none"
            grabCursor={true}
            spaceBetween={15}
            slidesPerView={6}
            breakpoints={{
              0: {
                slidesPerView: 3,
              },
              768: {
                slidesPerView: 6,
              },
            }}
          >
            <SwiperSlide>
              <Button className="ms-0 bg-black-100 border-0 active" onClick={active}>
                All
              </Button>
            </SwiperSlide>
            {categories.map((category, idx) => (
              <SwiperSlide key={idx}>
                <Button className="ms-0 bg-black-100 border-0" onClick={active}>
                  {category}
                </Button>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        {/* End tabs */}
        {/* Start cards */}
        <motion.div
          initial={{ x: -80 }}
          whileInView={{ x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Swiper
            slidesPerView={4}
            spaceBetween={15}
            grabCursor={true}
            loop={true}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            breakpoints={{
              0: {
                slidesPerView: 1,
              },
              520: {
                slidesPerView: 2,
              },
              768: {
                slidesPerView: 3,
              },
              992: {
                slidesPerView: 4,
              },
              1198: {
                slidesPerView: 5,
              },
            }}
            navigation={true}
            modules={[Pagination, Navigation]}
            className="mySwiper mt-4"
          >
            {properties
              .filter(prop => activeCategory === "All" || prop.category === activeCategory)
              .map((property, index) => (
                <SwiperSlide key={index}>
                  {" "}
                  <Card className="bg-black-100 rounded">
                    <Card.Body className="p-2">
                      <div className="rounded overflow-hidden position-relative">
                        <Card.Img
                          variant="top"
                          alt="img"
                          src={require(`../images/properties/${property.image}`)}
                        />
                        <i className="fa-regular fa-heart like" onClick={like}></i>
                      </div>
                      <h5 className="mt-2 text-white fw-normal">{property.name}</h5>
                      <p className="gray-90">@{property.sellerName}</p>
                      <div className="d-flex">
                        <div className="me-3">
                          {/* <CountDown h={9} m={45} s={8} /> */}
                          <CountDown timestamp={property.auctionEndTime} />
                          <span className="gray-90">Remaining Time</span>
                        </div>
                        <div>
                          <h6 className="text-white">{property.highestBid} ETH</h6>
                          <span className="gray-90">Current Bid</span>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </SwiperSlide>
              ))
            }
          </Swiper>
        </motion.div>
        {/* End cards */}
      </Container>
    </div>
    // End properties
  ) : null;
}

export default Properties;

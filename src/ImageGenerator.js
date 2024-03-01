import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './ImageGenerator.css';

const ImageGenerator = () => {
  const [images, setImages] = useState([]);
  const [query, setQuery] = useState('nature'); // Устанавливаем значение "nature" по умолчанию
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const sliderRef = useRef();

  const fetchImages = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://api.unsplash.com/photos/random', {
        params: {
          client_id: 'rerefiNtrcWOZe2mjmp56DqtPF8nJ4CITnrEuB-3QHs',
          query,
          count: 10,
        },
      });
      setImages(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching images:', error);
      setError('Error fetching images. Please try again.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchImages(); // Вызываем fetchImages при монтировании компонента
  }, []); 

  const handleSearch = async () => {
    await fetchImages();
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    } else if (event.key === 'ArrowLeft') {
      sliderRef.current.slickPrev();
    } else if (event.key === 'ArrowRight') {
      sliderRef.current.slickNext();
    }
  };

  const settings = {
    ref: sliderRef,
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="image-generator" onKeyDown={handleKeyDown} tabIndex={0}>
      <div className="search-container">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter search query (e.g., nature)"
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <Slider {...settings}>
          {images.map((image, index) => (
            <div key={image.id} className={index === 0 ? 'large-image' : ''}>
              <img src={image.urls.regular} alt={image.alt_description} />
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
};

export default ImageGenerator;

import React from 'react';
import notFoundImage from '../../assets/404.svg';
import styled from 'styled-components';

const NotFoundWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 100px);
`;

const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const NotFoundImage = styled.img`
  width: 100%;
  max-width: 400px;
`;

const NotFoundText = styled.h2`
  font-size: 1.5rem;
  margin-top: 1rem;
`;

const NotFound = () => {
  return (
    <NotFoundWrapper>
      <NotFoundContainer>
        <NotFoundImage src={notFoundImage} alt="404 Not Found" />
        <NotFoundText>Page not found</NotFoundText>
      </NotFoundContainer>
    </NotFoundWrapper>
  );
};

export default NotFound;
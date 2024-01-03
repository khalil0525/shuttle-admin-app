import React from 'react';
import {
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Text,
} from '@chakra-ui/react';

function TrainerResourceItem({ trainerResourceItem }) {
  const { question, answer, attachments } = trainerResourceItem;

  const images = attachments.filter(
    (attachment) => attachment.type === 'image'
  );
  const pdfLinks = attachments.filter(
    (attachment) => attachment.type === 'pdf'
  );

  return (
    <AccordionItem
      border="1px solid"
      borderColor="gray.200"
      borderRadius="md"
      mb={4}>
      {question && (
        <h2>
          <AccordionButton
            p={4}
            _hover={{ bg: 'teal.100' }}>
            <Box
              flex="1"
              textAlign="left"
              fontWeight="semibold"
              fontSize="lg">
              {question}
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
      )}{' '}
      <AccordionPanel p={4}>
        {answer && <Text>{answer}</Text>}
        {images.length > 0 && (
          <Box mt={4}>
            <Text fontWeight="bold">Images:</Text>
            <Box
              display="flex"
              flexWrap="wrap"
              mt={2}>
              {images.map((image, index) => (
                <img
                  key={index}
                  src={image.link}
                  alt={`Thumbnail ${index + 1}`}
                  style={{
                    maxWidth: '100px',
                    marginRight: '8px',
                    marginBottom: '8px',
                    borderRadius: '4px',
                  }}
                />
              ))}
            </Box>
          </Box>
        )}

        {pdfLinks.length > 0 && (
          <Box mt={4}>
            <Text fontWeight="bold">Download Links:</Text>
            <Box mt={2}>
              {pdfLinks.map((pdfLink, index) => (
                <Box
                  key={index}
                  mb={2}>
                  <a
                    href={pdfLink.link}
                    target="_blank"
                    rel="noopener noreferrer">
                    {pdfLink.name}
                  </a>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </AccordionPanel>
    </AccordionItem>
  );
}

export default TrainerResourceItem;

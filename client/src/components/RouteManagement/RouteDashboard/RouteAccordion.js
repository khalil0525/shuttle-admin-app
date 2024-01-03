import React from 'react';
import { Accordion, Box } from '@chakra-ui/react';
import RouteAccordionItem from './RouteAccordionItem';

function RouteAccordion({
  routes,
  handleCreateServiceUpdate,
  handleUpdateServiceUpdate,
  handleServiceUpdateDelete,
  handleEnableDisableRoute,
  setRoutes,
}) {
  return (
    <Box>
      <Accordion allowToggle>
        {routes.map((route) => (
          <RouteAccordionItem
            key={route.id}
            route={route}
            handleCreateServiceUpdate={handleCreateServiceUpdate}
            handleUpdateServiceUpdate={handleUpdateServiceUpdate}
            handleServiceUpdateDelete={handleServiceUpdateDelete}
            handleEnableDisableRoute={handleEnableDisableRoute}
            setRoutes={setRoutes}
          />
        ))}
      </Accordion>
    </Box>
  );
}

export default RouteAccordion;

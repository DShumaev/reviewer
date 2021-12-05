import {Box, Flex, Spinner, Text} from '@chakra-ui/react'


export const Loader = ({size = 'xl', top = '40vh'}) => {

    return (
        <Box mt={top}>
            <Flex
                direction="column"
                position="fixed"
                left="50vw"
                justifyContent="space-between"
                alignItems="center"
                h="120"
            >
                <Spinner
                    thickness="4px"
                    speed="0.65s"
                    emptyColor="gray.200"
                    color="blue.500"
                    size={size}
                />
                <Text textAlign="center">
                Loading data...
                <br></br>
                Please wait
                </Text>
            </Flex>
        </Box>
    )
}
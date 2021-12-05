import {Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Heading,
    VStack, Flex, Image, Tag, Box, useMediaQuery} from '@chakra-ui/react'
import {useContext} from 'react'
import {StarIcon} from '@chakra-ui/icons'
import ReactMarkdown from 'react-markdown'
import {CurrentReviewContext} from '../../context/CurrentReviewContext'


export const PreviewModal = (props) => {

    const {currentReviewData} = useContext(CurrentReviewContext)
    const {isOpen, onClose} = props
    const [isNotSmallerScreen] = useMediaQuery('(min-width: 600px)')
    const [isNotMobileScreen] = useMediaQuery('(min-width: 350px)')

    return (
        <>
            <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose} size="full" scrollBehavior="inside">
                <ModalOverlay />
                <ModalContent
                    w={isNotSmallerScreen ? "70%" : "96%"}>
                    <ModalHeader>Preview</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>

                        <VStack mt="100">
                            <VStack w="70%">
                                <VStack alignItems="start" overflow="hidden">
                                    <Heading>{currentReviewData.title}</Heading>
                                    {isNotMobileScreen ?
                                        <Flex pt="10%" direction="row" justifyContent="start">
                                            {currentReviewData.images && currentReviewData.images.map((imageLink) =>
                                                <Image
                                                    borderRadius="full"
                                                    boxSize="150px"
                                                    src={imageLink}
                                                    alt="picture"
                                                    mr="5"
                                                />
                                            )}
                                        </Flex>
                                        :
                                        <Image
                                            borderRadius="full"
                                            boxSize="150px"
                                            src={currentReviewData.images[0]}
                                            alt="picture"
                                            mr="5"
                                        />
                                    }
                                    <Flex wrap="wrap">
                                        {currentReviewData.tags && currentReviewData.tags.map((tag, index) =>
                                            <Tag shrink="0" mr="3px" mb="3px" size="md" key={index} variant="solid" colorScheme="teal"
                                                 _hover={{background: "teal.700", shadow: "md"}} cursor="pointer">
                                                {tag}
                                            </Tag>
                                        )}
                                    </Flex>
                                    <Box
                                        pt="2%"
                                        display="flex"
                                        alignItems="baseline"
                                        color="gray.500"
                                        fontWeight="semibold"
                                        letterSpacing="wide"
                                        fontSize="xs"
                                        textTransform="uppercase"
                                    >
                                        <Box mr="10px">
                                            {currentReviewData.date}
                                        </Box>
                                        <Box>
                                            {currentReviewData.author}
                                        </Box>
                                    </Box>
                                    <Flex
                                        wrap="wrap"
                                        mt="2"
                                        alignItems={isNotSmallerScreen ? "center": "start"}
                                        justifyContent={isNotSmallerScreen ? "start": "center"}
                                        direction={isNotSmallerScreen ? "row" : "column"}
                                    >
                                        <Box shrink="0">
                                            {Array(5)
                                                .fill("")
                                                .map((_, i) => (
                                                    <StarIcon
                                                        key={i}
                                                        color={i < Math.round(currentReviewData.rating)  ? "teal.500" : "gray.300"}
                                                    />
                                                ))}
                                        </Box>
                                        <Box
                                            as="span"
                                            ml={isNotSmallerScreen ? "2" : "0"}
                                            color="gray.600"
                                            fontSize="sm"
                                        >
                                            {(currentReviewData.ratingCount === 1) ? `1 evaluation` : `${currentReviewData.ratingCount} evaluations`}
                                        </Box>
                                        <Box
                                            as="span"
                                            ml={isNotSmallerScreen ? "5" : "0"}
                                            color="gray.600"
                                            fontSize="sm"
                                        >
                                            {(currentReviewData.likesCount === 1) ? `1 like` : `${currentReviewData.likesCount} likes`}
                                        </Box>
                                    </Flex>
                                    <Box
                                        mt="1"
                                        fontWeight="semibold"
                                        as="h4"
                                        lineHeight="tight"
                                    >
                                        category: {currentReviewData.category.toUpperCase()}
                                    </Box>
                                    <Box
                                        mt="1"
                                        fontWeight="semibold"
                                        as="h4"
                                        lineHeight="tight"
                                        isTruncated
                                    >
                                        Author's assessment: {currentReviewData.authorsRating} of 10
                                    </Box>
                                    <ReactMarkdown children={currentReviewData.text} />
                                    <Box h="4%"></Box>
                                </VStack>
                            </VStack>
                        </VStack>

                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}
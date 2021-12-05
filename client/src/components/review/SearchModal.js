import {Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Heading,
    useMediaQuery, SimpleGrid} from '@chakra-ui/react'
import {ReviewCard} from './ReviewCard'


export const SearchModal = (props) => {

    const {isOpen, onClose} = props
    const [isNotSmallerScreen] = useMediaQuery('(min-width: 600px)')

    const clickModalHandler = () => {
            onClose()
    }

    return (
        <>
            <Modal
                blockScrollOnMount={false}
                isOpen={isOpen}
                onClose={onClose}
                size="full"
                scrollBehavior="inside"
            >
                <ModalOverlay />
                <ModalContent
                    w={isNotSmallerScreen ? "70%" : "96%"}>
                    <ModalHeader>Results of search</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody onClick={clickModalHandler}>
                        {props.loadedData && (props.loadedData.length > 0)
                            ?
                            <SimpleGrid columns={[1, null, 2, 3]} spacing="40px">
                                {props.loadedData.map((card) =>
                                    <ReviewCard key={card.reviewId} {...card} />)}
                            </SimpleGrid>
                            :
                            <Heading>There are nothing reviews</Heading>
                        }
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}
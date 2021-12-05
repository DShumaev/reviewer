import {FormControl, FormLabel, IconButton, Input, InputGroup, InputRightElement, useDisclosure} from '@chakra-ui/react'
import * as React from 'react'
import {HiEye, HiEyeOff} from 'react-icons/hi'

export const PasswordField = React.forwardRef(({fillPassword}) => {
    const {isOpen, onToggle} = useDisclosure()

    const onClickReveal = () => {
        onToggle()
    }

    return (
        <FormControl id="password">
            <FormLabel>Password</FormLabel>
            <InputGroup>
                <InputRightElement>
                    <IconButton
                        bg="transparent !important"
                        icon={isOpen ? <HiEyeOff /> : <HiEye />}
                        onClick={onClickReveal}
                    />
                </InputRightElement>
                <Input
                    name="password"
                    type={isOpen ? 'text' : 'password'}
                    required
                    onChange={fillPassword}
                />
            </InputGroup>
        </FormControl>
    )
})

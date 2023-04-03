import { ActionIcon, createStyles, FileInput, Stack } from '@mantine/core';
import { IconUpload, IconX } from '@tabler/icons-react';
import { useEffect } from 'react';
import HelpPopover from '../Popover/HelpPopover';

const useStyles = createStyles((theme) => ({

}));

type ImagePickerProps = {
    image: File | null
    setImage: (image: File | null) => void
    setImageFilepath: (imageFilepath: string | undefined) => void
    label: string
    placeholder: string
    helper: string
}

const ImagePicker = ({ image, setImage, setImageFilepath, label, placeholder, helper }: ImagePickerProps) => {

    const { classes, theme } = useStyles();

    /**
     * Sets the image to the new image if it is a valid image
     * @param newImage 
     */
    const handleSetImage = (newImage: File) => {
        if (newImage.type === "image/jpeg" || newImage.type === "image/png")
            setImage(newImage);
        else
            setImage(null);
    }

    /**
 * Creates an object url for the image and sets it as the image filepath
 */
    useEffect(() => {
        let objectUrl = "";
        if (image !== null) {
            objectUrl = URL.createObjectURL(image)
            setImageFilepath(objectUrl)
        } else {
            setImageFilepath(undefined);
        }
        return () => URL.revokeObjectURL(objectUrl)
    }, [image, setImageFilepath])

    return (
        <Stack spacing={'xs'}>
            <FileInput
                label={label}
                value={image}
                onChange={handleSetImage}
                radius={theme.radius.md}
                icon={<IconUpload size={14} />}
                placeholder={placeholder}
                withAsterisk
                accept="image/png,image/jpeg"
                sx={{ flex: 1, flexGrow: 2 }}
                rightSection={
                    image !== null &&
                    <ActionIcon radius="xl" onClick={() => setImage(null)}>
                        <IconX size={theme.fontSizes.md} />
                    </ActionIcon>
                }
            />
            <HelpPopover helpText={helper} />
        </Stack>
    )
}

export default ImagePicker
import { Masonry } from '@mui/lab';
import { Autocomplete, Button, Card, CardContent, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Stack, styled, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { DatePicker } from '@mui/x-date-pickers';
import { Subject } from '@prisma/client';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import CreateAdLocationPicker from '../../components/elements/accounts/CreateAdLocationPicker';
import LargeAd from '../../components/elements/premiumads/LargeAd';
import MediumAd from '../../components/elements/premiumads/MediumAd';
import SmallAd from '../../components/elements/premiumads/SmallAd';
import { useAuth } from '../../context/SessionContext';
import { getUserDataFromApi } from '../../lib/accountHandling/AccountApiHandler';
import { UserDataProfile } from '../../lib/types/AccountHandlingTypes';

const Input = styled('input')({
    display: 'none',
});


const CreateAd = () => {

    // Ad settings
    const [adType, setAdType] = useState<string>("");
    const [adSize, setAdSize] = useState<number>(0);

    // Ad subject
    const [formAvailableSubjects, setFormAvailableSubjects] = useState<Subject[]>([]);
    const [selectedAdItem, setSelectedAdItem] = useState<Subject | null>(null);

    // Ad image
    const [imageFilepath, setImageFilepath] = useState<string>("");
    const [image, setImage] = useState("");

    // Ad description
    const [description, setDescription] = useState<string>("");

    // Form
    const formRef = useRef<HTMLFormElement>(null);
    const { token } = useAuth();

    // Ad until
    const [until, setUntil] = useState<Date | null>(
        new Date(),
    );

    // Data
    const [userData, setUserData] = useState<UserDataProfile>(null);

    const onImageChange = (event: ChangeEvent<HTMLInputElement>) => {

        if (event.target.files && event.target.files[0]) {

            const imageFile = event.target.files[0];
            setImageFilepath(imageFile.name);

            const reader = new FileReader();
            reader.addEventListener("load", (e) => {

                if (e.target?.result && typeof e.target.result === "string")
                    setImage(e.target.result);
            });

            reader.readAsDataURL(imageFile);
        }
    }

    const submitForm = async () => {

        if (formRef.current === null) return;
        let data = new FormData(formRef.current);

        data.append('user_id', userData !== null ? userData.user.id + "" : "");

        // Add subject ID if needed, server can handle the rest
        if (adType === "subject" && selectedAdItem !== null)
            data.append('subject_id', selectedAdItem.id + "");

        if (until !== null)
            data.append('until', until.getTime() + "");

        const res = await fetch('/api/account/user-create-ad', {
            method: 'POST',
            headers: {
            },
            body: data

        }).then((t) => t.json());

        console.log(res)

    }

    useEffect(() => {

        const getSubjects = async () => {
            const userDataRes = await getUserDataFromApi({ userSubjects: true, profile: true });
            if (userDataRes === null || userDataRes.status !== "SUCCESS") return;
            setFormAvailableSubjects(userDataRes.subjects || []);
            setUserData(userDataRes.profile || null);
        }

        getSubjects();

        return () => { }
    }, [token])

    const getAdHeadline = () => {

        if (adType === "subject") {
            if (selectedAdItem === null) return "[Title]";
            return selectedAdItem.name;
        } else if (adType === "institution") {
            return userData?.institution?.name || "[Institution Name]";
        } else {
            return "[Title]";
        }
    }

    return (

        <Masonry columns={{ xs: 1, sm: 2 }} spacing={2}>

            <Box component={"form"} ref={formRef} method={"POST"}>
                <Card>
                    <CardContent>
                        <Stack spacing={4}>

                            <Box>
                                <FormControl>
                                    <FormLabel id="ad-type-label">Select ad type</FormLabel>
                                    <RadioGroup
                                        aria-labelledby="ad-type-label"
                                        name="adtype"
                                        value={adType}
                                        onChange={(e) => setAdType(e.currentTarget.value)}
                                    >
                                        <FormControlLabel value="subject" control={<Radio />} label="Subject" />
                                        <FormControlLabel value="institution" control={<Radio />} label="Institution" />
                                    </RadioGroup>
                                </FormControl>

                                {
                                    adType === "subject" && (

                                        <Autocomplete
                                            disablePortal
                                            id="combo-box-institution"
                                            options={formAvailableSubjects}
                                            getOptionLabel={(option) => option.name}
                                            value={selectedAdItem}
                                            onChange={(e, value) => {
                                                setSelectedAdItem(value as Subject);
                                            }}
                                            sx={{ width: '100%', mt: 1 }}
                                            renderInput={(params) => <TextField {...params} label={"Subject"} />}
                                        />

                                    )
                                }
                            </Box>

                            <FormControl>
                                <FormLabel id="ad-size-label">Select ad size</FormLabel>
                                <RadioGroup
                                    aria-labelledby="ad-size-label"
                                    name="adsize"
                                    value={adSize}
                                    onChange={(e) => setAdSize(Number(e.currentTarget.value))}
                                >
                                    <FormControlLabel value="3" control={<Radio />} label="Large" />
                                    <FormControlLabel value="2" control={<Radio />} label="Medium" />
                                    <FormControlLabel value="1" control={<Radio />} label="Small" />
                                </RadioGroup>
                            </FormControl>

                            {
                                adSize === 3 && (<TextField name='description' label="Description" variant="outlined" value={description} onChange={(e) => setDescription(e.currentTarget.value)} />)
                            }

                            <Stack direction={"row"} spacing={2}>
                                <label htmlFor="contained-button-file">
                                    <Input accept="image/*" id="contained-button-file" type="file" name="profilepicture"
                                        onChange={onImageChange}
                                    />
                                    <Button variant="outlined" component="span" >
                                        Upload
                                    </Button>
                                </label>
                                <Typography>Selected image: {imageFilepath}</Typography>
                            </Stack>

                        </Stack>
                    </CardContent>
                </Card>
            </Box>

            <Card>
                <CardContent>

                    <Typography>Preview:</Typography>

                    {
                        adSize === 3 && <LargeAd headline={getAdHeadline()} description={description === "" ? "[Description]" : description} subtext='sub' title={getAdHeadline()} url='#' imgUrl={image} disableLink />
                        ||
                        adSize === 2 && <MediumAd headline={getAdHeadline()} subtext='sub' title={getAdHeadline()} url='#' imgUrl={image} disableLink />
                        ||
                        adSize === 1 && <SmallAd headline={getAdHeadline()} subtext='sub' title={getAdHeadline()} url='#' disableLink />
                    }

                </CardContent>
            </Card>

            <Card>
                <CardContent>
                    <Stack spacing={2}>

                        <DatePicker
                            disablePast
                            label="Book until"
                            openTo="day"
                            views={['year', 'month', 'day']}
                            value={until}
                            onChange={(e: Date | null) => setUntil(e)}
                            renderInput={(params: any) => <TextField {...params} />}
                        />

                        // TODO add a selector for location where ad should be displayed
                        <CreateAdLocationPicker />

                        <Button variant="contained" onClick={submitForm}>
                            Submit
                        </Button>

                    </Stack>
                </CardContent>
            </Card>

        </Masonry>
    )
}

export default CreateAd
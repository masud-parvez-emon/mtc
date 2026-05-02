import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { Alert, Autocomplete, Button, ButtonGroup, Divider, FormControl, FormHelperText, Grid, Input, InputLabel, MenuItem, Select, Snackbar, Stack, TextField, Tooltip } from '@mui/material';
import { Link, useNavigate, useParams } from 'react-router';
import { useGetContainerByIdQuery, useGetContainerCategoriesQuery, useSaveContainerMutation, useUpdateContainerMutation } from '../../../../api/api';
import AddCircleTwoToneIcon from '@mui/icons-material/AddCircleTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import { Controller, FieldErrors, SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

interface Container {
  number: string|null;
  category_id: string|null;
  trackings: ContainerTracking[];
}

interface ContainerTracking {
  id: number|null;
  date: string|null;
  location: string|null;
  status: 'start' | 'checkpoint' | 'over';
  description: string|null;
}

interface ContainerCategory {
  id: number|null;
  name: string|null;
  size_in_feet: number|null;
}

export default function Form() {

    const {id} = useParams();
    const navigate = useNavigate();
    const [alertState, setAlertState] = useState(false);
    const [container, setContainer] = useState<Container>({number: '', category_id: null, trackings: [{id: null, date: '', location: '', status: 'start', description: ''}]});
    const [containerCategories, setContainerCategories] = useState<readonly ContainerCategory[]>([]);
    const { data: containerData, isFetching: isContainerFetching} = id ? useGetContainerByIdQuery(id) : {data: container, isFetching: false};
    const { data: containerCategoriesData, isFetching: isContainerCategoriesFetching} = useGetContainerCategoriesQuery({});

    const [saveContainer] = useSaveContainerMutation();
    const [updateContainer] = useUpdateContainerMutation();

    const { register, control, reset, handleSubmit, watch, setError, formState: { errors } } = useForm<Container>({
        defaultValues: {
            number: '',
            category_id: null,
            trackings: [{id: null, date: '', location: '', status: 'start', description: ''}],
        }
    });
    const { fields, append, remove, prepend, insert, move, swap } = useFieldArray({
        control,
        name: "trackings",
    });

    const onError = (errors: FieldErrors<Container>) => console.log("Errors:", errors);
    // const watchTrackings = watch("trackings");
    const watchNumber = watch("number")

    const onSubmit: SubmitHandler<Container> = async(data) => {
        try {

            if(id){
                await updateContainer({id, ...data}).unwrap()
            }else{
                await saveContainer(data).unwrap()
            }
            setAlertState(true)
            navigate('/containers')
        } catch (error: any) {
            // Check if it's a Laravel validation error (Status 422)
            if (error.status === 422 && error.data?.errors) {
                const serverErrors = error.data.errors;

                // Loop through the keys (e.g., 'number', 'trackings.0.location')
                Object.keys(serverErrors).forEach((key, index) => {
                        setError(key as any, {
                            type: "server",
                            message: serverErrors[key][0],
                        }, { 
                            // Only focus the very first error found to avoid a jumpy UI
                            shouldFocus: index === 0 
                        });
                });
            } else {
                console.error("An unexpected error occurred:", error);
            }
        }
    };

    useEffect(() => {
        if (containerData) {
            if(containerData.trackings.length == 0){
                setContainer({...containerData, trackings: [{container_id: null, id: null, date: '', location: '', status: 'start', description: ''}]});
            }else{
                setContainer(containerData);
            }
            reset({...containerData})
        }
        if (containerCategoriesData) {
            setContainerCategories(containerCategoriesData);
        }
    }, [containerData, containerCategoriesData, reset]); 

    return (
        <>
            <ul className="flex space-x-2">
                <li>
                    <Link to="/containers" className="text-primary hover:underline">
                        Containers
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>{id ? 'Edit container' : 'Add container'}</span>
                </li>
            </ul>
            <Box className='p-5'>
                <form onSubmit={handleSubmit(onSubmit, onError)}>
                    <div className='flex flex-col items-center gap-5'>
                        <TextField
                            slotProps={ watchNumber ? {inputLabel: { shrink: true }} : {}}
                            label="Container Number"
                            placeholder='Example: MSDU7532999'
                            sx={{ width: 300 }}
                            size='small'
                            {...register('number', {
                                onChange: (e) => {
                                    e.target.value = e.target.value.toUpperCase();
                                }
                            })}
                            error={!!errors.number}
                            helperText={errors.number?.message}
                        />
                        <Controller
                            name="category_id"
                            control={control}
                            render={({ field: { ref, ...field }, fieldState, formState }) => (
                                <Autocomplete
                                    {...field}
                                    sx={{ width: 300 }}
                                    value={
                                        containerCategories.find((c) => c.id === field.value) || null
                                    }
                                    disablePortal
                                    options={containerCategories}
                                    getOptionLabel={(option) => option.id ? (`${option.size_in_feet+"' "+option.name}`).toUpperCase() : '' }
                                    onChange={(event, value) => field.onChange(value?.id)}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            placeholder="Select Category"
                                            size="small"
                                            label="Container Category"
                                            inputRef={ref}
                                            error={!!fieldState.error}
                                            helperText={fieldState.error?.message}
                                        />
                                    )}
                                />
                            )}
                        />
                    </div>
                    <Divider className='my-10'>Tracking</Divider>
                    <div className='space-y-5'>
                        {fields.map((field, index) => {

                            return (
                                <Stack 
                                    direction="row"
                                    divider={<Divider orientation="vertical" flexItem />}
                                    spacing={2}
                                    key={field.id}
                                    >
                                    <Grid container spacing={2} className='grow'>
                                        <Grid size={{ xs: 12, sm: 6, md: 3 }} >
                                                <Controller
                                                    name={`trackings.${index}.status`}
                                                    control={control}
                                                    render={({ field:{ref,...field}, fieldState: { error } }) => (
                                                        <FormControl fullWidth error={!!error}>
                                                            <InputLabel size='small'>Status</InputLabel>
                                                            <Select
                                                                {...field}
                                                                size='small'
                                                                label="Status"
                                                                {...(index == 0 ?  { disabled: true } : {})}
                                                                >
                                                                {index === 0 && <MenuItem value={'start'}>Start</MenuItem>}
                                                                <MenuItem value={'checkpoint'}>Checkpoint</MenuItem>
                                                                <MenuItem value={'over'}>Over</MenuItem>
                                                            </Select>
                                                            <FormHelperText>{error?.message}</FormHelperText>
                                                        </FormControl>
                                                    )}
                                                />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                            <Controller
                                                name={`trackings.${index}.date`}
                                                control={control}
                                                render={({ field:{ref,...field}, fieldState: { error } }) => (
                                                    <DatePicker
                                                        {...field}
                                                        label="Date"
                                                        value={field.value ? dayjs(field.value) : null}
                                                        format="DD-MMM-YYYY"
                                                        onChange={(newValue) => {
                                                            const formattedValue = newValue ? newValue.format('YYYY-MM-DD') : null;
                                                            field.onChange(formattedValue);
                                                        }}
                                                        slotProps={{
                                                            field: { clearable: true },
                                                            textField: {
                                                                inputRef: ref,
                                                                size: 'small',
                                                                error: !!error,
                                                                helperText: error?.message,
                                                            },
                                                        }}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                            <Controller
                                                name={`trackings.${index}.location`}
                                                control={control}
                                                render={({ field:{ref,...field}, fieldState: { error } }) => (
                                                    <TextField
                                                        {...field}
                                                        inputRef={ref}
                                                        label="Location"
                                                        placeholder='Enter Location'
                                                        fullWidth
                                                        size='small'
                                                        error={!!error}
                                                        helperText={error?.message}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                            <TextField label="Description" placeholder='Enter Description' {...register(`trackings.${index}.description`)} fullWidth size='small'/>
                                        </Grid>
                                    </Grid>
                                    <ButtonGroup variant="outlined" className='self-center'>
                                        <Tooltip title="Delete" disableInteractive>
                                            <span>
                                                <Button disabled={index == 0} onClick={() => remove(index)}>
                                                    <DeleteTwoToneIcon/>
                                                </Button>
                                            </span>
                                        </Tooltip>
                                        <Tooltip title="Add" disableInteractive>
                                            <span>
                                                <Button onClick={() => insert(index+1, {id: null, date: '', location: '', status: 'checkpoint', description: ''})}>
                                                    <AddCircleTwoToneIcon/>
                                                </Button>
                                            </span>
                                        </Tooltip>
                                    </ButtonGroup>
                                </Stack>
                            );
                        })}
                    </div>
                    <div className="text-center my-5">
                        <Button type="submit" variant='contained'>
                            Save
                        </Button>
                    </div>
                </form>
            </Box>



            <Snackbar
                open={alertState}
                autoHideDuration={3000}
                onClose={() => {
                    setAlertState(false)
                }}
                anchorOrigin={{vertical: 'top', horizontal: 'right'}}
            >
                <Alert
                    onClose={() => {
                        setAlertState(false)
                    }}
                    severity="success"
                    variant="filled"
                >
                    Action Successful
                </Alert>
            </Snackbar>
        </>
    );
}
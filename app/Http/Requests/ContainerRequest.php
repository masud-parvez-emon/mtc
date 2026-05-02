<?php

namespace App\Http\Requests;

use App\Models\Container;
use App\Models\ContainerCategory;
use Carbon\Carbon;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ContainerRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    protected function prepareForValidation()
    {
        // dd($this->all());
        // $this->merge([
        //     'slug' => Str::slug($this->slug),
        // ]);
    }

    public function rules()
    {
        return [
            'number' => ['required', Rule::unique(Container::class, 'number')->ignore($this->route('container'))],
            'category_id' => ['required', Rule::exists(ContainerCategory::class, 'id')],

            'trackings' => ['required', 'array'],
            // 'trackings.*' => ['array:id,date,description,location,status'],
            'trackings.*' => ['array'],

            'trackings.*.id' => ['nullable', Rule::in($this->route('container')?->trackings->pluck('id'))],
            'trackings.*.date' => ['required', 'date_format:Y-m-d', function ($attribute, $value, $fail) {
                // Parse the index from the attribute name (e.g., "trackings.1.date")
                preg_match('/trackings\.(\d+)\.date/', $attribute, $matches);
                $index = intval($matches[1]);

                if ($index > 0) {
                    $previousDate = $this->input("trackings." . ($index - 1) . ".date");

                    // If the previous date exists and is greater than the current date, fail.
                    if ($previousDate && $previousDate > $value) {
                        $formattedPreviousDate = Carbon::parse($previousDate)->format('d-M-Y');
                        $fail("The date must be later than or equal to the previous tracking date ($formattedPreviousDate).");
                    }
                }
            }],
            'trackings.*.location' => ['required'],
            'trackings.*.status' => ['required', 'in:start,checkpoint,over', function ($attribute, $value, $fail) {
                // 1. Parse the current index
                preg_match('/trackings\.(\d+)\.status/', $attribute, $matches);
                $currentIndex = intval($matches[1]);

                // 2. Get the total number of items in the trackings array
                $trackings = $this->input('trackings', []);
                $lastIndex = count($trackings) - 1;


                if ($currentIndex !== $lastIndex) {
                    if ($value === 'over') {
                        $fail("The 'over' status can only be used for the final tracking entry.");
                    }
                } 
            }],
        ];
    }

    // public function messages()
    // {
    //     return [
    //     ];
    // }

    public function attributes()
    {
        return [
            'number' => 'Container Number',
            'category_id' => 'Container Category',
            'trackings.*.date' => 'Date',
            'trackings.*.location' => 'Location'
        ];
    }

    protected function passedValidation()
    {
        // $this->replace($this->safe());
    }

}

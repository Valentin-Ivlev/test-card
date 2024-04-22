<?php

namespace App\Http\Controllers;

use App\Models\Card;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class CardController extends Controller
{
    public function index(Request $request)
    {
        $cookie_id = $request->cookie('user_id') ?? Str::random(24);
        return response()->json(Card::where('cookie_id', $cookie_id)->get());
    }

    public function store(Request $request)
    {
        $rules = [
            'card_number' => 'required|regex:/^[0-9]{16}$/',
            'expiry_month' => 'required|digits:2',
            'expiry_year' => 'required|digits:2',
            'cvv' => 'required|digits:3',
        ];

        $validator = Validator::make($request->all(), $rules);
        $validator->after(function ($validator) use ($request) {
            $year = $request->expiry_year;
            $month = $request->expiry_month;
            if ($year < now()->format('y')) {
                $validator->errors()->add('expiry_month', 'Неверный год окнчания срока действия.');
            }
            if ($year == now()->format('y') && ($month < now()->format('m') || $month > 12)) {
                $validator->errors()->add('expiry_month', 'Неверный месяц окнчания срока действия.');
            }
            if ($year > now()->format('y') && ($month < 1 || $month > 12)) {
                $validator->errors()->add('expiry_month', 'Неверный месяц окнчания срока действия.');
            }
        });

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $card = new Card($validator->validated());

        $cookie_id = $request->cookie('user_id') ?? Str::random(24);
        Cookie::queue('user_id', $cookie_id, 60 * 24 * 365);

        $card->cookie_id = $cookie_id;

        if ($request->save === true) {
            $card->save();
            return response()->json(['message' => 'Платеж проведен успешни. Карта сохранена.', 'card' => $card], 200);
        } else {
            return response()->json(['message' => 'Платеж проведен успешни.'], 200);
        }
    }
}

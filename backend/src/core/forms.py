from django import forms
from allauth.account.forms import SignupForm
from cities_light.models import Country, Region, City
from dal import autocomplete, forward

PAYMENT_CHOICES = {
    ('S', 'Stripe'),
    ('P', 'Paypal'),
    ('C', 'Credit'),
    ('E', 'EFT'),
    ('B', 'Bitcoin'),
    ('K', 'Kidney'),
}

class MyCustomSignupForm(SignupForm):
    first_name = forms.CharField(required=True)
    last_name = forms.CharField(required=True)
    def save(self, request):

        # Ensure you call the parent class's save.
        # .save() returns a User object.
        user = super(MyCustomSignupForm, self).save(request)

        # Add your own processing here.

        # You must return the original result.
        return user

class CheckoutForm(forms.Form):
    shipping_address = forms.CharField(required=False)
    shipping_address2 = forms.CharField(required=False)
    shipping_country = forms.ModelChoiceField(required=False,
                                        queryset = Country.objects.all(),
                                        widget=forms.Select(attrs={
                                            'class': 'custom-select d-block w-100'
                                        }))
    shipping_region = forms.ModelChoiceField(required=False,
                                        queryset = Region.objects.all(),
                                        widget=autocomplete.ModelSelect2(
                                            url='core:region-autocomplete',
                                            attrs={
                                            'class': 'custom-select d-block w-100'
                                        }))
    shipping_city = forms.ModelChoiceField(required=False,
                                        queryset = City.objects.all(),
                                        widget=autocomplete.ModelSelect2(
                                            url='core:city-autocomplete',
                                            forward=[forward.Field('shipping_region', 'region'),],
                                            attrs={
                                            'class': 'custom-select d-block'
                                        }))
    shipping_zip_code = forms.CharField()

    billing_address = forms.CharField(required=False)
    billing_address2 = forms.CharField(required=False)
    billing_country = forms.ModelChoiceField(required=False,
                                        queryset = Country.objects.all(),
                                        widget=forms.Select(attrs={
                                            'class': 'custom-select d-block w-100'
                                        }))
    billing_region = forms.ModelChoiceField(required=False,
                                        queryset = Region.objects.all(),
                                        widget=autocomplete.ModelSelect2(
                                            url='core:region-autocomplete',
                                            attrs={
                                            'class': 'custom-select d-block w-100'
                                        }))
    billing_city = forms.ModelChoiceField(required=False,
                                        queryset = City.objects.all(),
                                        widget=autocomplete.ModelSelect2(
                                            url='core:city-autocomplete',
                                            forward=[forward.Field('billing_region', 'region'),],
                                            attrs={
                                            'class': 'custom-select d-block'
                                        }))
    billing_zip_code = forms.CharField()

    same_billing_address = forms.BooleanField(required=False)
    set_default_shipping = forms.BooleanField(required=False)
    use_default_shipping = forms.BooleanField(required=False)
    set_default_billing = forms.BooleanField(required=False)
    use_default_billing = forms.BooleanField(required=False)
    payment_option = forms.ChoiceField(required=False, widget=forms.RadioSelect(), choices=PAYMENT_CHOICES)

class CouponForm(forms.Form):
    code = forms.CharField(widget=forms.TextInput(attrs={
        'class':'form-control',
        'placeholder':'Promo Code',
        'aria-label':'Recipient\'s username',
        'aria-describedby':'basic-addon2'
    }))

class RefundForm(forms.Form):
    ref_code = forms.CharField()
    message = forms.CharField(widget=forms.Textarea(attrs={
        'rows':4
    }))
    email = forms.EmailField()

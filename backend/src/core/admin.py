from django.contrib import admin
from .models import (
    Item,
    OrderItem,
    Order,
    Address,
    Payment,
    Coupon,
    Refund,
    Variation,
    ItemVariation)

def make_refund_accepted(modeladmin, request, queryset):
    queryset.update(refund_requested=False, refund_granted=True)


make_refund_accepted.short_description='Update order to refund granted'

class OrderAdmin(admin.ModelAdmin):
    list_display = ['user',
                    'ordered',
                    'being_delivered',
                    'received',
                    'refund_requested',
                    'refund_granted',
                    'billing_address',
                    'shipping_address',
                    'payment',
                    'coupon']
    list_display_links = [
                        'user',
                        'billing_address',
                        'shipping_address',
                        'payment',
                        'coupon'
    ]
    list_filter = [ 'user',
                    'ordered',
                    'being_delivered',
                    'received',
                    'refund_requested',
                    'refund_granted']
    search_fields =[
                    'user__username',
                    'ref_code'
    ]
    actions = [make_refund_accepted]

class PaymentAdmin(admin.ModelAdmin):
    list_display = ['user', 'timestamp']

class AddressAdmin(admin.ModelAdmin):
    list_display = [
        'user',
        'street_address',
        'apartment_address',
        'country',
        'region',
        'city',
        'zip',
        'address_type',
        'default'
    ]
    list_filter = ['default', 'address_type', 'country', 'region', 'city']
    search_fields = ['user', 'street_address', 'apartment_address', 'zip']

class ItemVariationAdmin(admin.ModelAdmin):
    list_display = [
        'variation'
        ,'value'
        ,'attachment'
    ]
    list_filter = ['variation', 'variation__item']
    search_fields = ['value']

class ItemVariationInLineAdmin(admin.TabularInline):
    model = ItemVariation
    extra = 1

class VariationAdmin(admin.ModelAdmin):
    list_display = ['item', 'name']
    list_filter = ['item']
    search_fields = ['name']
    inlines = [ItemVariationInLineAdmin]

admin.site.register(ItemVariation, ItemVariationAdmin)
admin.site.register(Variation, VariationAdmin)
admin.site.register(Item)
admin.site.register(OrderItem)
admin.site.register(Order, OrderAdmin)
admin.site.register(Address)
admin.site.register(Payment, PaymentAdmin)
admin.site.register(Coupon)
admin.site.register(Refund)

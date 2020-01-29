
int UTF16toUTF8(unsigned char* out, int* outlen,
          const unsigned char* inb, int* inlenb)
{
    unsigned char* outstart = out;
    const unsigned char* processed = inb;
    unsigned char* outend = out + *outlen;
    unsigned short* in = (unsigned short*)inb;
    unsigned short* inend;
    unsigned int c, d, inlen;
    unsigned char* tmp;
    int bits;

    if ((*inlenb % 2) == 1)
        (*inlenb)--;
    inlen = *inlenb / 2;
    inend = in + inlen;
    while (in < inend) {
        c = *in++;
        if ((c & 0xFC00) == 0xD800) { /* surrogates */
            if (in >= inend) { /* (in > inend) shouldn't happens */
                *outlen = out - outstart;
                *inlenb = processed - inb;
                return (-2);
            }
            d = *in++;

            if ((d & 0xFC00) == 0xDC00) {
                c &= 0x03FF;
                c <<= 10;
                c |= d & 0x03FF;
                c += 0x10000;
            } else {
                *outlen = out - outstart;
                *inlenb = processed - inb;
                return (-2);
            }
        }

        /* assertion: c is a single UTF-4 value */
        if (out >= outend)
            break;
        if      (c <    0x80) {  *out++=  c;                bits= -6; }
        else if (c <   0x800) {  *out++= ((c >>  6) & 0x1F) | 0xC0;  bits=  0; }
        else if (c < 0x10000) {  *out++= ((c >> 12) & 0x0F) | 0xE0;  bits=  6; }
        else                  {  *out++= ((c >> 18) & 0x07) | 0xF0;  bits= 12; }

        for (; bits >= 0; bits -= 6) {
            if (out >= outend)
                break;
            *out++ = ((c >> bits) & 0x3F) | 0x80;
        }
        processed = (const unsigned char*)in;
    }
    *outlen = out - outstart;
    *inlenb = processed - inb;
    return (0);
}

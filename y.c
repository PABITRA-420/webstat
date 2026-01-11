#include <stdio.h>

int main() {
    int a,b,i,j,k;
    char ch;
    printf(" + for addition \n - for subtraction \n * for multiplication \n / for division\n enter operation you want to perform \n");
    scanf(" %c",&ch);
    printf("enter two numbers");
    scanf("%d %d",&a,&b);
   
    switch(ch){
        case '+':
            k = a + b;
            break;
        case '-':
            k = a - b;
            break;
        case '*':
            k = a * b;
            break;
        case '/':
            if(b != 0){
                k = a / b;
            } else {
                printf("Error: Division by zero\n");
                return 1;
            }
            break;
        default:
            printf("Error: Invalid operator\n");
            return 1;
    }
    return 0;
}
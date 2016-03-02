using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ExpenseTracker.Model
{
    public class Expense : IIdentifiable
    {
        public int Id { get; set; }
        [Required]        
        [DataType(DataType.Date, ErrorMessage = "Please enter a valid date.")]
        [Display(Name = "Date")]
        public DateTime ExpenseDate { get; set; }
        [Required]
        [MaxLength(150)]
        [Display(Name = "Description")]
        public string Description { get; set; }
        [Range(0, 9999999999,
        ErrorMessage = "Value for {0} must be between {1} and {2}.")]
        [RegularExpression(@"^\$?\d+(\.(\d{2}))?$", ErrorMessage = "The Amount is not in the correct format")]
        [Required]
        [Display(Name = "Amount")]
        public decimal Amount { get; set; }

        [MaxLength(150)]
        [Display(Name = "Comment")]
        public string Comment { get; set; }
        public string UserId { get; set; }
    }
}

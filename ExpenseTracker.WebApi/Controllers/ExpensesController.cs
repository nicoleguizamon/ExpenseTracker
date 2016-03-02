using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using AutoMapper;
using AutoMapper.Mappers;
using ExpenseTracker.DataAccess;
using ExpenseTracker.Model;

namespace ExpenseTracker.WebApi.Controllers
{

    [Authorize]
    public class ExpensesController : ApiController
    {
        private readonly IUnitOfWork uow = null;
        private readonly IRepository<Expense> repository = null;
        
        public ExpensesController(IUnitOfWork uow, IRepository<Expense> repository)
        {
            this.uow = uow;
            this.repository = repository;            
        }

        public ExpensesController()
        {            
            uow = new UnitOfWork();
            repository = new Repository<Expense>(uow);            
        }

        // GET api/expenses
        /// <summary>
        /// The method search from database the user's expenses
        /// </summary>
        /// <returns>the list of all expenses of the logged user</returns>
        public IEnumerable<Expense> Get()
        {            
            IList<Expense> list = repository.AllByUser(User.Identity.Name).ToList();            
            return list;
        }


        // GET api/expenses/5
        /// <summary>
        /// The method searchs for the requested expense associated to the logged user
        /// </summary>
        /// <param name="id">this is the expense key</param>
        /// <returns>returns the expense if existis and if the expense is associated to the the logged user. 
        /// If not, returns an exception</returns>
        public Expense Get(int id)
        {            
            var expense = repository.Find(id, User.Identity.Name);            
            if (expense == null || expense.UserId != User.Identity.Name)
            {
                var resp = new HttpResponseMessage(HttpStatusCode.NotFound)
                {
                    Content = new StringContent(string.Format("Id {0} not found.", id)),
                    ReasonPhrase = "Expense id Not Found"
                };
                throw new HttpResponseException(resp);            
            }
            return expense;
        }


        // POST api/expenses
        /// <summary>
        /// The method creates a new expense for the logged user. If something is wrong with the id then it returns a
        /// bad request.
        /// </summary>
        /// <param name="expense">the expense object to be saved</param>
        public IHttpActionResult Post(Expense expense)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState); 
            }
            try
            {
                expense.UserId = User.Identity.Name;
                repository.Insert(expense);
                uow.Save();
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(HttpStatusCode.BadRequest);
                
            }
            return StatusCode(HttpStatusCode.NoContent);                                      
        }

        // PUT api/expenses/5
        /// <summary>
        /// The method updates an expense for the logged user. If the model state is not valid then it returns a bad
        /// request. If the user is not equal to the logged user then it returns not found.
        /// </summary>
        /// <param name="id">the expense object key</param>
        /// <param name="expense">the expense to be saved</param>
        public IHttpActionResult Put(int id, Expense expense)
        {
            if (expense ==null || !ModelState.IsValid || id != expense.Id)
            {
                return BadRequest(ModelState);            
            }
            if (expense.UserId != User.Identity.Name)
            {
                throw new HttpResponseException(HttpStatusCode.NotFound);                
            }
             
            if (IsExpenseAvailable(id))
            {
                repository.Update(expense);
                uow.Save();
            }
            else
            {
                var resp = new HttpResponseMessage(HttpStatusCode.NotFound)
                {
                    Content = new StringContent(string.Format("Id {0} not found.", id)),
                    ReasonPhrase = "Expense id Not Found"
                };
                throw new HttpResponseException(resp);
            }
            return StatusCode(HttpStatusCode.NoContent);                             
        }


        

        // DELETE api/expenses/5
        /// <summary>
        /// The method deletes an expense requested by the logged user. If the user is not the same than the logged
        /// user then it returns not found exception.
        /// </summary>
        /// <param name="id">the expense object key</param>
        public void Delete(int id)
        {

            Expense expense = repository.Find(id, User.Identity.Name);
            if (expense == null || expense.UserId != User.Identity.Name)
            {
                var resp = new HttpResponseMessage(HttpStatusCode.NotFound)
                {
                    Content = new StringContent(string.Format("Id {0} not found.", id)),
                    ReasonPhrase = "Expense id Not Found"
                };
                throw new HttpResponseException(resp);
            }
            repository.Delete(id);
            uow.Save();
            
        }


        //api/expenses/PdfReport
        /// <summary>
        /// this method calculates the total amount of expenses per week and the avarage day spending
        /// </summary>
        /// <returns>returns a collection of the total calculated objects.</returns>
        [Route("api/Expenses/PdfReport")]
        public IEnumerable<PdfReport> PdfReport()
        {                           
            var result = repository.AllByUser(User.Identity.Name).ToList()
                .GroupBy(repo => new { WeekNumber = WeekOfYear(repo.ExpenseDate), Year = repo.ExpenseDate.Year })
                .Select(p => new PdfReport()
                {
                    Year = p.Key.Year,
                    WeekNumber = p.Key.WeekNumber,
                    Amount = p.Sum(q=>q.Amount),
                    Average = p.Sum(q=>q.Amount) / 7
                });                

            return result.ToList();            
        }

        protected override void Dispose(bool disposing)
        {
            if (repository != null)
                repository.Dispose();
            if (uow != null)
                uow.Dispose();
            base.Dispose(disposing);
        }


        private bool IsExpenseAvailable(int id)
        {
            return repository.FindId(id, User.Identity.Name);
        }

        private int WeekOfYear(DateTime date)
        {
            var day = (int)CultureInfo.CurrentCulture.Calendar.GetDayOfWeek(date);
            return CultureInfo.CurrentCulture.Calendar.GetWeekOfYear(date.AddDays(4 - (day == 0 ? 7 : day)), 
                CalendarWeekRule.FirstFourDayWeek, DayOfWeek.Monday);
        }
    }
}
